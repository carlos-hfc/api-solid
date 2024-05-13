import "dotenv/config"

import { execSync } from "node:child_process"
import { randomUUID } from "node:crypto"

import { PrismaClient } from "@prisma/client"
import { Environment } from "vitest"

const prisma = new PrismaClient()

function generateDatabaseURL(databaseName: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.")
  }

  const url = new URL(process.env.DATABASE_URL)

  url.pathname = `/${databaseName}`

  return url.toString()
}

export default <Environment>{
  transformMode: "ssr",
  name: "prisma",
  async setup() {
    const schema = randomUUID()

    const dbName = `apisolid_test_${schema.replace(/-/g, "_")}`
    const dbUrl = generateDatabaseURL(dbName)

    process.env.DATABASE_URL = dbUrl

    execSync("npx prisma migrate deploy")

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${dbName};`)

        await prisma.$disconnect()
      },
    }
  },
}
