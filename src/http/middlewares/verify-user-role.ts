import type { FastifyReply, FastifyRequest } from "fastify"

export function verifyUserRole(roleToVerify: "ADMIN" | "MEMBER") {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (role !== roleToVerify) {
      return reply.code(401).send({
        message: "Unauthorized",
      })
    }
  }
}