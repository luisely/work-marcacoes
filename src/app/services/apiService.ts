import { api } from '@/api'
import type { GetPontosResponse } from '@/app/types/Pontos'

export interface PontoData {
	PK: string
	SK: string
	name: string
	date: string
	time: string
}

export async function getRecords(): Promise<GetPontosResponse> {
	const response = await api.get(`records`)
	return response.data
}

export async function registerPonto(pontoData: PontoData) {
	return await api.post('register', {
		pontoData,
	})
}
