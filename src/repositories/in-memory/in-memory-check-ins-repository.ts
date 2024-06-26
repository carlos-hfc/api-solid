import { randomUUID } from "node:crypto"

import type { CheckIn, Prisma } from "@prisma/client"
import dayjs from "dayjs"

import type { CheckInsRepository } from "../check-ins-repository"

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findById(id: string) {
    return this.items.find(item => item.id === id) ?? null
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter(item => item.userId === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date")
    const endOfTheDay = dayjs(date).endOf("date")

    const checkInOnSameDate = this.items.find(item => {
      const checkInDate = dayjs(item.createdAt)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return item.userId === userId && isOnSameDate
    })

    return checkInOnSameDate ?? null
  }

  async countByUserId(userId: string) {
    return this.items.filter(item => item.userId === userId).length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gymId: data.gymId,
      userId: data.userId,
      createdAt: new Date(),
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex(item => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
  }
}
