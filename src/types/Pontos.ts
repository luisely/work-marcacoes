export interface Record {
	SK: string
	PK: string
	date: string
	time: string
	name: string
}

export interface GetRecordResponse {
	marcacoes: Record[]
}
