import { QueryClientProvider } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './app/contexts/AuthContext'
import { queryClient } from './lib/queryCliente'
import type { PontoData } from './services/apiService'
import { RegistroForm } from './view/form/RegisterForm'
import { DisplayPontos } from './view/pontos/DisplayPontos'

function App() {
	const methods = useForm<PontoData>({
		defaultValues: {
			date: new Date().toDateString(),
			time: new Date().toLocaleString('pt-BR', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			}),
		},
	})

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<FormProvider {...methods}>
					<div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-dvh flex items-center justify-center">
						<div className="flex flex-col items-center justify-center h-full w-full max-w-xs">
							<RegistroForm />

							<DisplayPontos />
						</div>
					</div>
				</FormProvider>
			</AuthProvider>
			<Toaster />
		</QueryClientProvider>
	)
}

export default App
