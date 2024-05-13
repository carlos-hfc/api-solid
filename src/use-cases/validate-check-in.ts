import type { CheckIn } from "@prisma/client"
import dayjs from "dayjs"

import type { CheckInsRepository } from "@/repositories/check-ins-repository"

import { LateCheckInValidation } from "./errors/late-check-in-validation"
import { ResourceNotFound } from "./errors/resource-not-found"

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkinsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFound()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      "minutes",
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidation()
    }

    checkIn.validatedAt = new Date()

    await this.checkinsRepository.save(checkIn)

    return { checkIn }
  }
}
