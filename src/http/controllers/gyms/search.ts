import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case"

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { page, query } = querySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  })

  return reply.code(200).send({ gyms })
}
