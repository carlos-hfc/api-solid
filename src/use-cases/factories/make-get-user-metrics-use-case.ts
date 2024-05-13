import { PrisaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"

import { GetUserMetricsUseCase } from "../get-user-metrics"

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrisaCheckInsRepository()
  const useCase = new GetUserMetricsUseCase(checkInsRepository)

  return useCase
}
