import { PrisaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"

import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history"

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrisaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}
