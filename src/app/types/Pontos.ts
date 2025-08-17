export interface Ponto {
  expireAt: number
  date: string
  cpf3Digits: string
  SK: string
  time: string
  PK: string
  name: string
}

export interface GetPontosResponse {
  pontos: Ponto[]
}