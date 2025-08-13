import dayjs from 'dayjs'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { Button } from '@/components/ui/button'
import { usePontosController } from './usePontosController'

type PontosAgrupados = Record<string, string[]>

export function Pontos() {
	const { registros, handleOpenConfirmModal, confirmModalOpen, handleCloseConfirmModal, isLoadingDelete, handleDelete, pontoToBeDeleted } =
		usePontosController()

	let agrupadoPorData: PontosAgrupados = {}
	let datasOrdenadas: string[] = []

	if (registros) {
		// Agrupar por data
		agrupadoPorData = registros.reduce<PontosAgrupados>((acc, ponto) => {
			if (!acc[ponto.date]) acc[ponto.date] = []
			acc[ponto.date].push(ponto.time)
			return acc
		}, {})

		// Ordenar datas em ordem decrescente
		datasOrdenadas = Object.keys(agrupadoPorData).sort((a, b) => {
			return dayjs(b, 'DD/MM/YYYY').unix() - dayjs(a, 'DD/MM/YYYY').unix()
		})
	}

	if (confirmModalOpen) {
		return (
			<ConfirmDeleteModal
				pontoToBeDeleted={pontoToBeDeleted}
				isLoading={isLoadingDelete}
				onConfirm={handleDelete}
				title={`Tem certeza que deseja excluir ?`}
				onClose={handleCloseConfirmModal}
			/>
		)
	}

	return (
		<div className="text-white w-full flex flex-col mx-auto overflow-y-auto no-scrollbar backdrop-blur-md rounded-md mb-2 transition-all">
			{datasOrdenadas.map((data) => {
				const horariosOrdenados = agrupadoPorData[data].sort((a, b) => {
					return dayjs(a, 'HH:mm').unix() - dayjs(b, 'HH:mm').unix()
				})

				return (
					<div key={data} className="w-full">
						<div className="flex flex-col text-center font-bold text-lg bg-zinc-900/35 py-1">{data}</div>
						<div className="flex justify-between py-1 px-2 text-sm bg-zinc-900/25 overflow-x-auto whitespace-nowrap snap-x snap-mandatory scrollbar-thin-md scroll-smooth">
							{horariosOrdenados.map((hora) => (
								<div key={hora + data}>
									<Button
										onClick={() => handleOpenConfirmModal({ date: data, time: hora })}
										className="text-sm cursor-pointer text-white inline-block"
										variant={'link'}
									>
										{hora}
									</Button>
								</div>
							))}
						</div>
					</div>
				)
			})}
		</div>
	)
}
