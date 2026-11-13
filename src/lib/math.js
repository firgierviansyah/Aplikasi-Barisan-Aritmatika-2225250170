export const un = (a, b, n) => a + (n - 1) * b
export const terms = (a, b, count) => Array.from({ length: count }, (_, i) => un(a, b, i + 1))
