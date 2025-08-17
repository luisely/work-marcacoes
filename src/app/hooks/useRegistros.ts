import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiService } from '@/services'
import { registerPonto } from '@/services/apiService'

export function useRegistros() {
	const queryClient = useQueryClient()
	const queryKey = ['records']

	const queryState = queryClient.getQueryState(queryKey)
	const isError = queryState?.status === 'error'

	const { data, isFetching, isLoading, refetch } = useQuery({
		queryKey: ['records'],
		queryFn: apiService.getRecords,
		retry: 3,
		staleTime: 60 * 60 * 1000,
	})

	return {
		registros: data?.marcacoes ?? [],
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
