import { api } from '@/api'

export interface PontoData {
	name: string
	date: string
	time: string
}

export async function registerPonto(pontoData: PontoData) {
	return await api.post('register', {
		pontoData,
	})
}
