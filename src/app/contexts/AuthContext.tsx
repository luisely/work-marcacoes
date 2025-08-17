import { useQuery } from '@tanstack/react-query'
import { createContext, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { localStorageKeys } from '../config/localStorageKeys'
import type { User } from '../entities/User'
import { apiService } from '../services'

interface AuthContextValue {
	signedIn: boolean
	user: User | undefined
	signin(accessToken: string): void
}

export const AuthContext = createContext({} as AuthContextValue)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [signedIn, setSignedIn] = useState<boolean>(() => {
		const storedAccessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN)

		return !!storedAccessToken
	})

	const { isError, isSuccess, isFetching, data } = useQuery({
		queryKey: ['users', 'me'],
		queryFn: apiService.getProfile,
		enabled: signedIn,
		staleTime: Infinity,
	})

	const signin = useCallback((accessToken: string) => {
		localStorage.setItem(localStorageKeys.ACCESS_TOKEN, accessToken)

		setSignedIn(true)
	}, [])

	useEffect(() => {
		if (isError) {
			toast.error('Sua sessão expirou!')
		}
	}, [isError])

	return (
		<AuthContext.Provider value={{ signedIn: isSuccess && signedIn, signin, user: data }}>{!isFetching && children}</AuthContext.Provider>
	)
}
