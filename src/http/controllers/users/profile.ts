import type { FastifyReply, FastifyRequest } from "fastify"

import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-profile-use-case"

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return reply.code(200).send({
    user: {
      ...user,
      passwordHash: undefined,
    },
  })
}
