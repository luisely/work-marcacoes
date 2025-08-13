import { api } from '@/api'
import type { GetPontosResponse } from '@/types/Pontos'

export interface PontoData {
	PK: string
	SK: string
	name: string
	cpf3Digits: string
	date: string
	time: string
}

export async function getPontos(name: string, digits: string): Promise<GetPontosResponse> {
	const response = await api.get(`getPontos/${name}/${digits}`)
	return response.data
}

export async function registerPonto(pontoData: PontoData) {
	return await api.post('register', {
		...pontoData,
		date: new Date(pontoData.date).toLocaleDateString('pt-BR', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}),
	})
}
