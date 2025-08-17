import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useRegistros } from '@/app/hooks/useRegistros'
import { apiService } from '@/app/services'
import type { PontoData } from '@/app/services/apiService'
import { queryClient } from '@/lib/queryCliente'

interface Ponto {
	date: string
	time: string
}

export function usePontosController() {
	const { watch } = useFormContext<PontoData>()
	const [confirmModalOpen, setConfirmModalOpen] = useState(false)
	const [pontoToBeDeleted, setPontoToBeDeleted] = useState<null | Ponto>(null)

	const { registros, isLoading } = useRegistros(watch().name, watch().cpf3Digits)

	const { isPending: isLoadingDelete, mutateAsync: removePonto } = useMutation({
		mutationFn: () => apiService.deletePonto(watch().name, watch().cpf3Digits, pontoToBeDeleted!.date, pontoToBeDeleted!.time),
	})

	async function handleDelete() {
		try {
			await removePonto()

			queryClient.invalidateQueries({ queryKey: ['registros'] })
			toast.success('Transação foi excluída com sucesso!')
			handleCloseConfirmModal()
		} catch {
			toast.error('Erro ao deletar transação!')
		}
	}

	function handleOpenConfirmModal({ date, time }: Ponto) {
		setConfirmModalOpen(true)
		setPontoToBeDeleted({
			date,
			time,
		})
	}

	function handleCloseConfirmModal() {
		setConfirmModalOpen(false)
		setPontoToBeDeleted(null)
	}

	return {
		registros,
		isLoading,
		confirmModalOpen,
		handleOpenConfirmModal,
		handleCloseConfirmModal,
		pontoToBeDeleted,
		isLoadingDelete,
		handleDelete,
	}
}
