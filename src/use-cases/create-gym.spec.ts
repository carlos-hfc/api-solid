import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"

import { CreateGymUseCase } from "./create-gym"

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe("Create gym use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it("should be able to register", async () => {
    const { gym } = await createGymUseCase.execute({
      title: "Gym 1",
      latitude: -27.2092052,
      longitude: -49.6401091,
      phone: null,
      description: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
