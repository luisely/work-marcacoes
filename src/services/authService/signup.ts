import { api } from '@/api'

export interface SignupParams {
	name: string
	pin: string
}

interface SignupResponse {
	token: string
}

export async function signup(body: SignupParams) {
	const { data } = await api.post<SignupResponse>('/auth/signup', body)

	return data
}
