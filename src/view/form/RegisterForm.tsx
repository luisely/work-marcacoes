import { ChevronDownIcon } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAddRegistro } from '@/app/hooks/useRegistros'
import type { PontoData } from '@/app/services/apiService'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'

export function RegistroForm() {
	const { register, handleSubmit, control } = useFormContext<PontoData>()
	const { mutate, isPending } = useAddRegistro()

	function onSubmit(data: PontoData) {
		mutate(data, {
			onSuccess: () => {
				toast.success('Registro realizado com sucesso!')
				localStorage.setItem('formSavedData', JSON.stringify({ name: data.name, cpf3Digits: data.cpf3Digits }))
			},
		})
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid grid-cols-[220px_minmax(80px,_1fr)] grid-rows-2 gap-0 w-full max-w-xs rounded-t-md mt-4 bg-zinc-900/35 backdrop-blur-md">
				<div className="border-t border-l border-[#3d3940]/25 rounded-tl-md">
					<Input
						{...register('name', { required: true })}
						className="w-full max-w-xs py-6 px-4 rounded-none rounded-tl-md outline-none text-lg border-none text-white "
						placeholder="USER"
						maxLength={20}
						spellCheck="false"
						// 4. EVENTOS TIPADOS
					/>
				</div>
				<div className="border-t border-r border-[#3d3940]/25 rounded-tr-md">
					<Input
						{...register('cpf3Digits', { required: true, pattern: /^\d{3}$/ })}
						inputMode="numeric"
						className="w-full max-w-xs py-6 px-4 rounded-none rounded-tr-md outline-none text-lg text-center hover:border-slate-500 transition border-1  border-none text-white"
						type="password"
						placeholder="PIN"
						maxLength={6}
					/>
				</div>
				<div className="border-t border-l border-[#3d3940]/25">
					<Controller
						name="date"
						control={control}
						rules={{ required: true }}
						render={({ field }) => (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										id="date-picker"
										className="w-full py-6 rounded-none text-lg justify-between font-normal bg-transparent border-none text-white hover:border-[#3d3940]/25 hover:bg-transparent hover:text-white"
									>
										{new Date(field.value).toLocaleDateString('pt-BR', {
											year: 'numeric',
											month: '2-digit',
											day: '2-digit',
										})}

										<ChevronDownIcon />
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto overflow-hidden p-0" align="start">
									<Calendar
										mode="single"
										selected={new Date(field.value)}
										captionLayout="dropdown"
										onSelect={(val) => field.onChange(val?.toDateString() ?? null)}
									/>
								</PopoverContent>
							</Popover>
						)}
					/>
				</div>
				<div className="border-t border-r border-[#3d3940]/25">
					<Input
						{...register('time', { required: true })}
						className="w-full max-w-xs py-6 px-[14px] rounded-none  outline-none text-lg border-none text-center text-white hover:border-slate-500 [&::-webkit-calendar-picker-indicator]:invert"
					/>
				</div>
			</div>
			<Button
				type="submit"
				size="lg"
				disabled={isPending}
				className="w-full mb-2 rounded-none bg-zinc-900/35 border border-[#3d3940]/25 font-bold text-white py-2  text-lg rounded-b hover:bg-zinc-900/45  backdrop-blur-md disabled:opacity-50 cursor-pointer transition"
			>
				{isPending ? <Spinner /> : 'Registrar'}
			</Button>
		</form>
	)
}
