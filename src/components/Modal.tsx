import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
	open: boolean
	children: React.ReactNode
	title: string
	rightAction?: React.ReactNode
	onClose?: () => void
}

export function Modal({ children, open, title, rightAction, onClose }: ModalProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onClose}>
			<Dialog.Portal>
				<Dialog.Overlay className={cn('bg-black/70 fixed inset-0 z-50 backdrop-blur-sm', 'data-[state=open]:animate-overlayShow')} />
				<Dialog.Content
					className={cn(
						'fixed-center p-6 space-y-10 bg-zinc-900/35 backdrop-blur-md rounded-2xl z-[51] outline-none',
						'shadow-[0px_11px_20px_0px_rgba(0,0,0,0.10)] w-full max-w-xs',
						'data-[state=open]:animate-contentShow ',
					)}
				>
					<header className="h-12 w-full flex items-center justify-between text-gray-800">
						<button
							type="button"
							className="w-12 h-12 flex items-center justify-center outline-none hover:text-red-600 transition-colors"
							onClick={onClose}
						>
							<X className="w-6 h-6 text-white cursor-pointer hover:text-red-600" />
						</button>
						<span className="text-lg font-bold tracking-tight text-white">{title}</span>
						<div className="w-12 h-12 flex items-center justify-center text-white">{rightAction}</div>
					</header>
					<div>{children}</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}
