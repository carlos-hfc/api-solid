import type { Prisma, User } from "@prisma/client"

import type { UsersRepository } from "../users-repository"

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find(item => item.email === email)

    return user ?? null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: "user-1",
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
    }

    this.items.push(user)

    return user
  }
}
