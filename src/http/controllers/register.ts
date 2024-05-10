import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { UserAlreadyExists } from "@/use-cases/errors/user-already-exists"
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = bodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      return reply.code(409).send({
        message: error.message,
      })
    }

    throw error
  }

  return reply.code(201).send()
}
