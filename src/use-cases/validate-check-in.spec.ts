import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"

import { LateCheckInValidation } from "./errors/late-check-in-validation"
import { ResourceNotFound } from "./errors/resource-not-found"
import { ValidateCheckInUseCase } from "./validate-check-in"

let checkInsRepository: InMemoryCheckInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe("Authenticate use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)

    // await gymsRepository.create({
    //   id: "gym-1",
    //   title: "Gym 1",
    //   latitude: -27.2092052,
    //   longitude: -49.6401091,
    //   phone: null,
    //   description: null,
    // })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to validated the check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: "gym-1",
      userId: "user-1",
    })

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validatedAt).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validatedAt).toEqual(expect.any(Date))
  })

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: "createdCheckIn.id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gymId: "gym-1",
      userId: "user-1",
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21 // 21min
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidation)
  })
})
