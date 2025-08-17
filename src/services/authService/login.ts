import { api } from '@/api'

export interface SigninParams {
	name: string
	pin: string
}

interface SigninResponse {
	token: string
}

export async function login(body: SigninParams) {
	const { data } = await api.post<SigninResponse>('/auth/signin', body)

	return data
}
