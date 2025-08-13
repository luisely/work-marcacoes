import { Pontos } from './Pontos'
import { usePontosController } from './usePontosController'

export function DisplayPontos() {
	const { isLoading } = usePontosController()

	return isLoading ? '' : <Pontos />
}
