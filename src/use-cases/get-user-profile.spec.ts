import { hash } from "bcryptjs"
import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"

import { ResourceNotFound } from "./errors/resource-not-found"
import { GetUserProfileUseCase } from "./get-user-profile"

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe("GetUserProfile use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "john.doe@email.com",
      passwordHash: await hash("123456", 6),
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual("John Doe")
  })

  it("should not be able to get-user-profile with wrong e-mail", async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: "user-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
