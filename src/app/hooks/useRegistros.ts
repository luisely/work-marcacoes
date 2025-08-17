import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPontos, registerPonto } from '@/app/services/apiService'

export function useRegistros(name: string, digits: string) {
	const queryClient = useQueryClient()
	const queryKey = ['registros', name, digits]

	const queryState = queryClient.getQueryState(queryKey)
	const isError = queryState?.status === 'error'

	const { data, isFetching, isLoading, refetch } = useQuery({
		queryKey: ['registros', name, digits],
		queryFn: getPontos,
		enabled: !!name && digits.length === 3 && !isError,
		retry: 3,
		staleTime: 60 * 60 * 1000,
	})

	return {
		registros: data?.pontos ?? [],
		isFetching,
		isLoading,
		refetch,
	}
}

export function useAddRegistro() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: registerPonto,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['registros', variables.name],
			})
		},
	})
}
