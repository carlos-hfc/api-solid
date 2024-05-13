import { hash } from "bcryptjs"
import type { FastifyInstance } from "fastify"
import request from "supertest"

import { prisma } from "@/lib/prisma"

export async function createAndAuthUser(app: FastifyInstance, isAdmin = false) {
  await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@email.com",
      passwordHash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  })

  const authResponse = await request(app.server).post("/sessions").send({
    email: "john.doe@email.com",
    password: "123456",
  })

  const { token } = authResponse.body

  return { token }
}
