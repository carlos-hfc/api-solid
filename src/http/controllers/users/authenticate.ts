import type { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"

import { InvalidCredentials } from "@/use-cases/errors/invalid-credentials"
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case"

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = bodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      },
    )

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: true,
      })
      .code(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return reply.code(400).send({
        message: error.message,
      })
    }

    throw error
  }
}
