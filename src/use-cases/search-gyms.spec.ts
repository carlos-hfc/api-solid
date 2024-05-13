import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"

import { SearchGymsUseCase } from "./search-gyms"

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: SearchGymsUseCase

describe("Seach gyms use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Javascript Gym",
      latitude: -27.2092052,
      longitude: -49.6401091,
      phone: null,
      description: null,
    })
    await gymsRepository.create({
      title: "Typescript Gym",
      latitude: -27.2092052,
      longitude: -49.6401091,
      phone: null,
      description: null,
    })

    const { gyms } = await createGymUseCase.execute({
      query: "Javascript",
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: "Javascript Gym" })])
  })

  it("should be able to fetch paginated gym search", async () => {
    for (let index = 1; index <= 22; index++) {
      await gymsRepository.create({
        title: `Javascript Gym ${index}`,
        latitude: -27.2092052,
        longitude: -49.6401091,
        phone: null,
        description: null,
      })
    }

    const { gyms } = await createGymUseCase.execute({
      query: "Javascript",
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript Gym 21" }),
      expect.objectContaining({ title: "Javascript Gym 22" }),
    ])
  })
})
