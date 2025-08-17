import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Flashlight } from 'lucide-react'
import { useState } from 'react'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import { Button } from '@/components/ui/button'
import { usePontosController } from './usePontosController'

dayjs.extend(customParseFormat)

type PontosAgrupados = Record<string, string[]>

export function Pontos() {
	const { registros, handleOpenConfirmModal, confirmModalOpen, handleCloseConfirmModal, isLoadingDelete, handleDelete, pontoToBeDeleted } =
		usePontosController()

	const [activeIndex, setActiveIndex] = useState<number | null>(null)

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
			return dayjs(b, 'DD/MM/YYYY', true).valueOf() - dayjs(a, 'DD/MM/YYYY', true).valueOf()
		})
	}

	const toggleActive = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index)
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
		<div
			data-active="false"
			className="text-white w-full flex flex-col mx-auto overflow-y-auto no-scrollbar backdrop-blur-md rounded-md mb-2 transition-all"
		>
			{datasOrdenadas.map((data, index) => {
				const horariosOrdenados = agrupadoPorData[data].sort((a, b) => {
					return dayjs(a, 'HH:mm').unix() - dayjs(b, 'HH:mm').unix()
				})

				return (
					<div
						key={index}
						data-active={activeIndex === index ? 'true' : 'false'}
						className="w-full data-[active=true]:bg-black/50 transition first:rounded-t-md"
					>
						<div className="w-full flex justify-center items-center relative font-bold text-lg bg-zinc-900/35 py-1 ">
							<div className="w-5/6 text-center translate-x-1/12">{data}</div>
							<div className="w-1/6 flex justify-end px-2">
								<Flashlight onClick={() => toggleActive(index)} className=" w-4 h-4 text-white cursor-pointer hover:text-amber-500" />
							</div>
						</div>
						<div
							data-active="false"
							className="flex justify-between py-1 px-2 text-sm bg-zinc-900/25 overflow-x-auto whitespace-nowrap snap-x snap-mandatory scrollbar-thin-md scroll-smooth"
						>
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
