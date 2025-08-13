import { api } from '@/api'

export async function deletePonto(name: string, digits: string, date: string, time: string) {
	const { data } = await api.delete(`delete/${name}/${digits}/record?date=${date}&time=${time}`)

	return data
}
