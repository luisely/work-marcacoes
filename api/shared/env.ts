import { z } from 'zod'

const schema = z.object({
	JWT_SECRET: z.string().min(1),
	TABLE_NAME: z.string().min(1),
})

export const env = schema.parse(process.env)
