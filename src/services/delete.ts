import { api } from '@/api'

export async function deletePonto(date: string, time: string) {
	const { data } = await api.delete(`delete/record?date=${date}&time=${time}`)

	return data
}
