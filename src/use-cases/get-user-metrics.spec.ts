import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"

import { GetUserMetricsUseCase } from "./get-user-metrics"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let getUserMetricsUseCase: GetUserMetricsUseCase

describe("Get user metrics use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)
  })

  it("should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      gymId: "gym-1",
      userId: "user-1",
    })
    await checkInsRepository.create({
      gymId: "gym-2",
      userId: "user-1",
    })

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: "user-1",
    })

    expect(checkInsCount).toEqual(2)
  })
})
