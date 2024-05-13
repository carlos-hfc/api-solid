import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case"

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const { gymId } = paramsSchema.parse(request.params)

  const bodySchema = z.object({
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180),
  })

  const { latitude, longitude } = bodySchema.parse(request.body)

  const checkInUseCase = makeCheckInUseCase()

  await checkInUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    gymId,
    userId: request.user.sub,
  })

  return reply.code(201).send()
}
