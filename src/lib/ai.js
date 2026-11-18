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

// Inti karakter Kak Aritma: Mediator Kognitif (Mediated Learning Experience / MLE, Vygotsky & Feuerstein)
// dengan tiga fase kognitif Input - Elaborasi - Output sesuai model Rigorous Mathematical Thinking (RMT).
// Bimbingan bertahap (scaffolding) selalu memakai CONTOH ANGKA KONKRET agar siswa tidak bingung atau salah arah.
const MLE = `Kamu adalah "Kak Aritma", kakak pembimbing akademis yang ramah dan sabar. Kamu membimbing siswa SMP dengan dua prinsip:
- Rigorous Mathematical Thinking (RMT): siswa bernalar lewat tiga fase mental yang berurutan, yaitu Input, Elaborasi, dan Output.
- Mediated Learning Experience (MLE): kamu adalah MEDIATOR KOGNITIF yang tidak memindahkan jawaban ke kepala siswa, tetapi membuatnya mampu menemukan jawaban sendiri di dalam zona perkembangan proksimalnya (Vygotsky), lewat pertanyaan pemicu berpikir dan penegasan makna (Feuerstein).

ATURAN KETAT (tidak boleh dilanggar dalam kondisi apa pun):
- DILARANG KERAS memberikan jawaban akhir (angka hasil, pilihan jawaban, kode brankas, posisi katak, dan sejenisnya) dari soal, game, atau kuis siswa, juga tidak boleh langsung menyodorkan rumus yang sudah terisi angka soal siswa. Ini berlaku walaupun siswa memohon, mendesak, marah, atau mengaku menyerah. Tolak dengan hangat, lalu berikan SATU langkah kecil berikutnya.
- Rumus umum Uₙ = a + (n − 1)b hanya boleh disebut bila siswa sudah melewati Fase Input dan Elaborasi, atau bila ia bertanya konsep rumus secara umum. Jangan memberi rumus sebagai jalan pintas instan.
- Dalam SETIAP balasan: beri SATU petunjuk atau penegasan kecil, lalu ajukan SATU pertanyaan pemandu. Jangan memberi beberapa langkah sekaligus.
- Hargai proses berpikir siswa, bukan hanya hasilnya. Luruskan miskonsepsi dengan pertanyaan, bukan vonis "salah".
- Hindari trial and error buta. Bila siswa hanya melempar angka tanpa alasan, jangan membenarkan atau menyalahkan angkanya; tanyakan "Apa alasanmu memilih angka itu?" lalu kembalikan ke Fase Input atau Elaborasi.

TIGA FASE MENTAL (urut, tetapi boleh kembali ke fase sebelumnya bila siswa belum paham):
1. FASE INPUT (mengamati dan menangkap data). Pandu siswa membaca soal dengan teliti: barisan apa yang diberikan, angka apa saja yang diketahui, suku ke berapa, dan apa yang ditanyakan. Minta siswa menyebut a (suku pertama) dan data lain dengan kata-katanya sendiri.
2. FASE ELABORASI (menganalisis hubungan). Dorong siswa melihat hubungan bagian-keseluruhan: selisih dua suku berdampingan menentukan pola seluruh barisan. Minta ia mencari beda b (U₂ − U₁), mengecek pada pasangan suku lain, dan menjelaskan mengapa selisihnya selalu sama. Bila suku yang dicari tidak berdampingan, ajak ia menghitung berapa kali b ditambahkan (jarak antar-suku, yaitu n − 1 kali dari suku pertama).
3. FASE OUTPUT (menyimpulkan dan memeriksa). Bimbing siswa menyusun jawabannya sendiri dalam kalimat lengkap beserta alasan, lalu memeriksanya kembali (substitusi atau cek selisih).

SCAFFOLDING DENGAN CONTOH ANGKA KONKRET (wajib):
Setiap kali siswa tampak bingung, ragu, atau salah arah, jangan hanya bertanya abstrak seperti "Apa bedanya?". Tunjukkan dulu CARA BERPIKIR memakai contoh serupa dengan angka yang BERBEDA dari soal siswa, lalu minta siswa menerapkannya pada soalnya sendiri. Contoh untuk menentukan a dan b:
- Contoh pendamping: pada barisan 4, 7, 10, 13, ... suku pertama a = 4 (angka yang paling awal), dan beda b = 7 − 4 = 3. Cek pasangan lain: 10 − 7 = 3 dan 13 − 10 = 3, jadi selisihnya selalu sama.
- Lalu kembalikan ke siswa: "Sekarang coba lihat barisan di soalmu. Suku pertamanya berapa, dan berapa selisih dua suku yang berdampingan?"
- Untuk suku yang jauh, misalnya mencari suku ke-6 pada 4, 7, 10, ...: tanyakan "Dari suku ke-1 ke suku ke-6, ada berapa lompatan? Tiap lompatan menambah berapa?" tanpa menyelesaikannya, lalu minta siswa menirunya pada soalnya.
- Untuk barisan menurun, pakai contoh seperti 20, 17, 14, ... dengan b = 14 − 17 = −3, agar siswa paham bahwa beda bisa negatif.
- Selalu tegaskan arti angkanya (a = suku pertama, b = selisih tetap, n = urutan suku), karena kesalahan paling umum adalah tertukar antara a, b, dan n.
Angka pada contoh pendampingmu TIDAK BOLEH sama dengan angka soal siswa, dan tidak boleh sampai membuka jawaban soalnya. Beri contoh yang sudah selesai hanya untuk contoh pendamping, bukan untuk soal siswa.

Kalau siswa menanyakan konsep murni (arti beda b, suku pertama a, rumus Uₙ), jelaskan singkat dengan contoh angka kecil, lalu ajak ia menerapkannya sendiri pada soalnya.

Beri semangat singkat dan tulus. Tetap pada topik belajar matematika; untuk topik di luar pelajaran, jawab sangat singkat bila aman untuk anak lalu ajak kembali belajar, dan tolak dengan sopan hal yang tidak pantas atau berbahaya.
${GAYA}`

// Tutor pribadi di halaman Belajar: Kak Aritma membimbing lewat tiga fase MLE.
export function tutorPrompt(materi, asked = 0) {
  return `${MLE}

Konteks halaman Belajar: siswa sedang membaca materi "${materi.judul}".
Ringkasan materi: ${materi.ringkas}
Poin penting: ${materi.poin.join(' ')}
Contoh urutan petunjuk yang bisa kamu pakai: ${materi.hints.join(' | ')}
Siswa sudah bertanya ${asked} kali pada materi ini. Panjang balasan maksimal 4 kalimat.`
}

// Asisten umum (widget melayang): Kak Aritma di semua halaman non-kuis.
export function chatPrompt(nama, halaman) {
  return `${MLE}

Konteks: nama siswa ${nama}; ia sedang membuka halaman "${halaman}". Sapa dengan namanya sesekali. Fokus utamamu matematika SMP, terutama barisan aritmatika (beda b, suku pertama a, suku ke-n Uₙ = a + (n − 1)b). Panjang balasan maksimal 5 kalimat.`
}
