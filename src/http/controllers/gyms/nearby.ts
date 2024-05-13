import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case"

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    latitude: z.number().refine(value => Math.abs(value) <= 90),
    longitude: z.number().refine(value => Math.abs(value) <= 180),
  })

  const { latitude, longitude } = querySchema.parse(request.query)

  const nearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await nearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.code(200).send({ gyms })
}
