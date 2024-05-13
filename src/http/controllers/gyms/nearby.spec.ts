import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { app } from "@/app"
import { createAndAuthUser } from "@/utils/test/create-and-auth-user"

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthUser(app)

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Gym",
        latitude: -27.2092052,
        longitude: -49.6401091,
        phone: null,
        description: null,
      })
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far Gym",
        latitude: -27.0610928,
        longitude: -49.5229501,
        phone: null,
        description: null,
      })

    const response = await request(app.server)
      .get("/gyms/nearby")
      .set("Authorization", `Bearer ${token}`)
      .query({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym",
      }),
    ])
  })
})
