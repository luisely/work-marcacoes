import { api } from '@/api'
import type { User } from '../entities/User'

type ProfileResponse = User

export async function getProfile(): Promise<ProfileResponse> {
	const response = await api.get('profile')
	return response.data
}
