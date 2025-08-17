import { Input } from '@/components/ui/input'
import { useLoginController } from './useLoginController'

export function LoginForm() {
	const { handleSubmit, register } = useLoginController()

	return (
		<form onSubmit={handleSubmit}>
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
					{...register('pin', { required: true, pattern: /^\d{3}$/ })}
					inputMode="numeric"
					className="w-full max-w-xs py-6 px-4 rounded-none rounded-tr-md outline-none text-lg text-center hover:border-slate-500 transition border-1  border-none text-white"
					type="password"
					placeholder="PIN"
					maxLength={6}
				/>
			</div>
		</form>
	)
}
