import { compare } from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"

import { UserAlreadyExists } from "./errors/user-already-exists"
import { RegisterUseCase } from "./register"

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe("Register use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })

  it("should be able to register", async () => {
    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@email.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should hash user password upon registration", async () => {
    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "john.doe@email.com",
      password: "123456",
    })

    const isPasswordCorrectlyHashed = await compare("123456", user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to register with same e-mail", async () => {
    const email = "john.doe@email.com"

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "123456",
    })

    await expect(() =>
      registerUseCase.execute({
        name: "John Doe",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExists)
  })
})
