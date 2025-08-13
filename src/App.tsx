import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
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

	useEffect(() => {
		const savedData = localStorage.getItem('formSavedData')

		if (savedData) {
			console.log(JSON.parse(savedData))
			methods.reset(JSON.parse(savedData)) // Set form values from localStorage
		}
	}, [methods.reset])

	return (
		<FormProvider {...methods}>
			<div className="bg-[url('/pic1_.jpg')] bg-cover w-screen h-screen flex items-center justify-center">
				<div className="flex flex-col items-center justify-center h-full w-full max-w-xs">
					<RegistroForm />

					<DisplayPontos />
				</div>
			</div>
		</FormProvider>
	)
}

export default App
