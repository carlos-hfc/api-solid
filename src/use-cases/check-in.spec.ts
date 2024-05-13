import { Decimal } from "@prisma/client/runtime/library"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"

import { CheckInUseCase } from "./check-in"
import { MaxDistance } from "./errors/max-distance"
import { MaxNumberOfCheckIns } from "./errors/max-number-of-check-ins"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe("Authenticate use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: "gym-1",
      title: "Gym 1",
      latitude: -27.2092052,
      longitude: -49.6401091,
      phone: null,
      description: null,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check in", async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: "gym-1",
        userId: "user-1",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckIns)
  })

  it("should not be able to check in twice, but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-2",
      title: "Gym 2",
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      phone: "",
      description: "",
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: "gym-2",
        userId: "user-1",
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistance)
  })
})
