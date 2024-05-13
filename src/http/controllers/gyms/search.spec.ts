import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/app"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"

describe("Search Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to search gyms", async () => {
    const { token } = await createAndAuthUser(app, true)

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym",
        description: "Description",
        phone: "11999999999",
        latitude: -27.2092052,
        longitude: -49.6401091,
      })
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Typescript Gym",
        description: "Description",
        phone: "11999999999",
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const response = await request(app.server)
      .get("/gyms/search")
      .set("Authorization", `Bearer ${token}`)
      .query({
        query: "Javascript",
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Javascript Gym",
      }),
    ])
  })
})
