import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { useAuth } from '@/app/hooks/useAuth'
import { authService } from '@/services/authService'
import type { SigninParams } from '@/services/authService/login'

const schema = z.object({
	name: z.string().nonempty('Username é obrigatório'),
	pin: z.string().nonempty('Senha é obrigatória').min(6, 'A senha deve conter pelo menos 8 digitos'),
})

type FormData = z.infer<typeof schema>

export function useLoginController() {
	const {
		handleSubmit: hookFormSubmit,
		register,
		formState: { errors },
	} = useForm<FormData>({ resolver: zodResolver(schema) })

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: SigninParams) => {
			return authService.login(data)
		},
	})

	const { signin } = useAuth()

	const handleSubmit = hookFormSubmit(async (data) => {
		try {
			const { token } = await mutateAsync(data)

			signin(token)
		} catch (error) {
			toast.error('Credencias inválidas')
		}
	})

	return { handleSubmit, register, errors, isPending }
}
