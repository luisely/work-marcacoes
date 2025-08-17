import { api } from '@/api'
import type { GetRecordResponse } from '@/types/Pontos'

export async function getRecords(): Promise<GetRecordResponse> {
	const response = await api.get(`records`)
	return response.data
}
