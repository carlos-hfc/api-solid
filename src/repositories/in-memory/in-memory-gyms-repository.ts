import { randomUUID } from "node:crypto"

import type { Gym, Prisma } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates"

import type { FindManyNearbyParams, GymsRepository } from "../gyms-repository"

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find(item => item.id === id)

    return gym ?? null
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter(item => {
      const distance = getDistanceBetweenCoordinates({
        from: {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        to: {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      })

      return distance < 10
    })
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter(item => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      createdAt: new Date(),
    }

    this.items.push(gym)

    return gym
  }
}
