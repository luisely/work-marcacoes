import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { getPontos, registerPonto } from '@/services/apiService'
import type { GetPontosResponse } from '@/types/Pontos'

type PontosAgrupados = Record<string, string[]>

export function useRegistros(name: string, digits: string) {
	const queryClient = useQueryClient()
	const queryKey = ['registros', name, digits]

	const queryState = queryClient.getQueryState(queryKey)
	const isError = queryState?.status === 'error'

	const ordenaRegistros = (data: GetPontosResponse) => {
		const agrupadoPorData = data.pontos.reduce<PontosAgrupados>((acc, ponto) => {
			if (!acc[ponto.date]) acc[ponto.date] = []
			acc[ponto.date].push(ponto.time)
			return acc
		}, {})

		const datasOrdenadas = Object.keys(agrupadoPorData).sort((a, b) => {
			return dayjs(b, 'DD/MM/YYYY').unix() - dayjs(a, 'DD/MM/YYYY').unix()
		})

		return {
			agrupadoPorData,
			datasOrdenadas,
		}
	}

	const { data, isFetching, isLoading, refetch } = useQuery({
		queryKey: ['registros', name, digits],
		queryFn: () => getPontos(name, digits),
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
				queryKey: ['registros', variables.name, variables.cpf3Digits],
			})
		},
	})
}
