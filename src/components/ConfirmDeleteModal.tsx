import { TrashIcon } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './ui/button'

interface Ponto {
	date: string
	time: string
}

interface ConfirmDeleteModalProps {
	onConfirm(): void
	onClose(): void
	title: string
	description?: string
	isLoading: boolean
	pontoToBeDeleted: Ponto | null
}

export default function ConfirmDeleteModal({
	onConfirm,
	onClose,
	title,
	description,
	isLoading,
	pontoToBeDeleted,
}: ConfirmDeleteModalProps) {
	return (
		<Modal open title="Excluir" onClose={onClose}>
			<div className="flex flex-col items-center text-center gap-6">
				<div className="w-[52px] h-[52px] rounded-full bg-red-700/45 flex items-center justify-center">
					<TrashIcon className="w-6 h-6 text-white" />
				</div>
				<p className="font-bold w-full tracking-tight text-white">{title}</p>
				<div className="">
					<p className="w-[186px] text-white">{pontoToBeDeleted?.date}</p>
					<p className="w-[186px] text-white">{pontoToBeDeleted?.time}</p>
				</div>

				{description && <p className="tracking-tight text-gray-800 text-sm">{description}</p>}
			</div>

			<div className="mt-10 space-y-4">
				<Button className="w-full cursor-pointer bg-red-700/45 hover:bg-red-700/55" onClick={onConfirm} disabled={isLoading}>
					Sim, desejo excluir!
				</Button>

				<Button className="bg-transparent w-full text-white cursor-pointer " variant="ghost" onClick={onClose} disabled={isLoading}>
					Cancelar
				</Button>
			</div>
		</Modal>
	)
}
