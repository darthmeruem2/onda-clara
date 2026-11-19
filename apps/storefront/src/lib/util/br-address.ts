export const estadosBrasileiros = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
]

export const formatCep = (value: string) =>
  value.replace(/\D/g, "").slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2")

export const isCep = (value: unknown): value is string =>
  typeof value === "string" && /^\d{5}-?\d{3}$/.test(value)
