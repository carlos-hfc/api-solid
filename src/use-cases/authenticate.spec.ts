import { hash } from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"

import { AuthenticateUseCase } from "./authenticate"
import { InvalidCredentials } from "./errors/invalid-credentials"

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe("Authenticate use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john.doe@email.com",
      passwordHash: await hash("123456", 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: "john.doe@email.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should not be able to authenticate with wrong e-mail", async () => {
    await expect(() =>
      authenticateUseCase.execute({
        email: "john.doe@email.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })

  it("should not be able to authenticate with wrong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "john.doe@email.com",
      passwordHash: await hash("123456", 6),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: "john.doe@email.com",
        password: "123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentials)
  })
})
