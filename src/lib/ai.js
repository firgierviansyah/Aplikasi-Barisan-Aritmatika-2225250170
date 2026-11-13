import { GEMINI_API_KEY, GEMINI_MODELS } from './config.js'

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models/'

export class AiError extends Error {
  constructor(kind, status) { super(kind); this.kind = kind; this.status = status }
}

const MESSAGES = {
  network: 'Sepertinya internetmu sedang bermasalah. Cek koneksi, lalu kirim lagi ya.',
  timeout: 'Asisten terlalu lama menjawab. Coba kirim lagi sebentar lagi.',
  aborted: '',
  quota: 'Banyak sekali yang bertanya saat ini. Tunggu sebentar, lalu coba lagi ya.',
  key: 'Asisten belum bisa dihubungi karena ada masalah pada kunci layanan. Beri tahu gurumu ya.',
  blocked: 'Pertanyaan itu tidak bisa kujawab. Coba tanya hal lain seputar belajar ya.',
  empty: 'Aku belum menemukan jawaban yang pas. Coba tulis pertanyaanmu dengan cara lain.'
}
export const friendly = (e) => MESSAGES[e?.kind] || 'Maaf, asisten sedang bermasalah. Coba lagi sebentar lagi.'

// Membersihkan sisa format markdown agar tampil rapi di gelembung chat.
export const clean = (t) => String(t)
  .replace(/\*\*(.+?)\*\*/gs, '$1').replace(/__(.+?)__/gs, '$1')
  .replace(/^#{1,6}\s*/gm, '').replace(/^\s*[*-]\s+/gm, '• ').replace(/`/g, '').trim()

// Gemini memakai peran "user" dan "model", dan lebih aman jika peran bergantian.
export function toContents(history, question) {
  const out = []
  const push = (role, text) => {
    const last = out[out.length - 1]
    if (last && last.role === role) last.parts[0].text += '\n' + text
    else out.push({ role, parts: [{ text }] })
  }
  for (const m of history.slice(-12)) if (!m.error && m.content) push(m.role === 'assistant' ? 'model' : 'user', m.content)
  push('user', question)
  while (out[0] && out[0].role !== 'user') out.shift()
  return out
}

// Mengurai satu blok teks SSE ("data: {...}") dari Gemini. Mengembalikan potongan teks dan info penutup.
function parseSse(text, state) {
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line.startsWith('data:')) continue
    const payload = line.slice(5).trim()
    if (!payload || payload === '[DONE]') continue
    let j
    try { j = JSON.parse(payload) } catch { continue }
    if (j.promptFeedback?.blockReason) state.blocked = true
    const cand = j.candidates?.[0]
    if (cand?.finishReason === 'SAFETY') state.blocked = true
    for (const p of cand?.content?.parts || []) if (p.text && !p.thought) state.full += p.text
  }
}

// Streaming: jawaban dikirim kata per kata lewat onText(teksSejauhIni).
// timeoutMs = batas tunggu (default 45 detik) untuk respons pertama DAN jeda antar-potongan data;
// selama data masih mengalir, jawaban panjang tidak akan terputus oleh timeout.
export async function askGemini({ system, history = [], question, onText, signal, timeoutMs = 45000 }) {
  let lastErr
  for (const model of GEMINI_MODELS) {
    const ctrl = new AbortController()
    let timedOut = false, timer
    const arm = () => { clearTimeout(timer); timer = setTimeout(() => { timedOut = true; ctrl.abort() }, timeoutMs) }
    const onAbort = () => ctrl.abort()
    signal?.addEventListener('abort', onAbort)
    const state = { full: '', blocked: false }
    try {
      const body = {
        systemInstruction: { parts: [{ text: system }] },
        contents: toContents(history, question),
        generationConfig: { temperature: 0.6, maxOutputTokens: 1200 }
      }
      if (model.startsWith('gemini-2.5')) body.generationConfig.thinkingConfig = { thinkingBudget: 0 } // tanpa "berpikir" agar cepat
      arm()
      const res = await fetch(`${BASE}${model}:streamGenerateContent?alt=sse`, {
        method: 'POST', signal: ctrl.signal, body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY }
      })
      if (!res.ok) {
        let msg = ''
        try { msg = (await res.json())?.error?.message || '' } catch { /* abaikan */ }
        const kind = res.status === 401 || res.status === 403 || /api key/i.test(msg) ? 'key' : res.status === 429 ? 'quota' : 'server'
        lastErr = new AiError(kind, res.status)
        if (kind === 'key') throw lastErr
        continue // model tidak ada / kuota penuh / gangguan: coba model berikutnya
      }
      let streamErr = null
      if (res.body?.getReader) {
        const reader = res.body.getReader(), dec = new TextDecoder()
        let buf = '', shown = ''
        try {
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            arm() // ada data baru: perpanjang batas tunggu
            buf += dec.decode(value, { stream: true })
            const cut = buf.lastIndexOf('\n')
            if (cut < 0) continue
            parseSse(buf.slice(0, cut), state); buf = buf.slice(cut + 1)
            if (state.full !== shown) { shown = state.full; onText?.(clean(shown)) }
          }
          buf += dec.decode()
          if (buf) parseSse(buf, state)
        } catch (e) { streamErr = e } // putus di tengah jalan: pakai teks yang sudah diterima jika ada
      } else { // peramban lama tanpa streaming: baca sekaligus
        parseSse(await res.text(), state)
      }
      const text = clean(state.full)
      if (text) { onText?.(text); return text }
      if (streamErr) throw streamErr
      throw new AiError(state.blocked ? 'blocked' : 'empty')
    } catch (e) {
      if (e instanceof AiError) { if (['key', 'blocked', 'empty'].includes(e.kind)) throw e; lastErr = e; continue }
      if (signal?.aborted) throw new AiError('aborted')
      const err = new AiError(timedOut || e?.name === 'AbortError' ? 'timeout' : 'network')
      if (state.full) throw err // sudah ada teks parsial: jangan ganti model
      lastErr = err
      if (err.kind === 'network') throw err
      continue
    } finally { clearTimeout(timer); signal?.removeEventListener('abort', onAbort) }
  }
  throw lastErr || new AiError('server')
}

const GAYA = `Gaya menulis: Bahasa Indonesia yang sederhana, hangat, dan mengalir, cocok untuk anak SMP. Jangan memakai markdown (tanpa tanda bintang, tanpa tanda #). Tulis rumus dengan teks biasa, misalnya Uₙ = a + (n − 1)b, dan gunakan tanda × untuk perkalian.`

// Tutor pribadi di halaman Belajar: membimbing bertahap, bukan memberi jawaban instan.
export function tutorPrompt(materi, asked = 0) {
  return `Kamu adalah tutor pribadi yang sabar untuk siswa SMP yang sedang belajar Barisan Aritmatika di sebuah aplikasi belajar.
Materi yang sedang dibaca siswa: "${materi.judul}".
Ringkasan materi: ${materi.ringkas}
Poin penting: ${materi.poin.join(' ')}
Contoh urutan petunjuk yang bisa kamu pakai: ${materi.hints.join(' | ')}

Aturan membimbing (scaffolding):
1. Pahami dulu bagian mana yang membingungkan siswa.
2. Beri SATU petunjuk kecil, lalu ajukan SATU pertanyaan pemandu agar siswa berpikir sendiri.
3. Jangan langsung memberi jawaban akhir untuk soal latihan. Naikkan bantuan sedikit demi sedikit: petunjuk, lalu langkah awal, lalu contoh serupa dengan angka berbeda.
4. Jika siswa sudah mencoba dan masih buntu, atau jelas-jelas meminta penjelasan konsep (bukan jawaban soal), jelaskan lebih lengkap dengan contoh angka kecil.
5. Beri semangat singkat. Maksimal 4 kalimat per balasan. Tetap pada topik barisan aritmatika; jika di luar topik, ajak kembali dengan ramah.
Siswa sudah bertanya ${asked} kali pada materi ini.
${GAYA}`
}

// Asisten umum (widget melayang): siswa boleh bertanya apa saja.
export function chatPrompt(nama, halaman) {
  return `Kamu adalah "Kak Aritma", asisten belajar yang ramah di aplikasi Belajar Barisan Aritmatika untuk siswa SMP. Nama siswa: ${nama}. Siswa sedang membuka halaman: ${halaman}.
Siswa boleh bertanya apa saja seputar belajar. Fokus utamamu matematika SMP, terutama barisan aritmatika (beda b, suku pertama a, suku ke-n Uₙ = a + (n − 1)b).
- Jawab singkat (maksimal 5 kalimat) dan beri contoh angka kecil bila perlu.
- Jika siswa menanyakan soal latihan atau PR, bimbing langkah demi langkah dengan petunjuk dan pertanyaan pemandu. Jangan langsung memberi jawaban akhir, kecuali siswa sudah mencoba dan masih buntu.
- Untuk topik di luar pelajaran, jawab singkat jika aman untuk anak, lalu ajak kembali belajar. Tolak dengan sopan topik yang tidak pantas atau berbahaya.
${GAYA}`
}
