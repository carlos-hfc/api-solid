import { beforeEach, describe, expect, it } from "vitest"

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"

import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase

describe("Fetch user check-ins history use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInsRepository,
    )
  })

  it("should be able to fetch check-ins history", async () => {
    await checkInsRepository.create({
      gymId: "gym-1",
      userId: "user-1",
    })
    await checkInsRepository.create({
      gymId: "gym-2",
      userId: "user-1",
    })

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: "user-1",
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gymId: "gym-1",
      }),
      expect.objectContaining({
        gymId: "gym-2",
      }),
    ])
  })

  it("should be able to fetch paginated check-ins history", async () => {
    for (let index = 1; index <= 22; index++) {
      await checkInsRepository.create({
        gymId: `gym-${index}`,
        userId: "user-1",
      })
    }

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: "user-1",
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gymId: "gym-21",
      }),
      expect.objectContaining({
        gymId: "gym-22",
      }),
    ])
  })
})
