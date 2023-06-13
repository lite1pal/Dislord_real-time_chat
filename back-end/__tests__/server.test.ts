import request from "supertest";

import app from "../app";

let newUser = { id: "", username: "", email: "", age: 0, password: "" };

describe("User", () => {
  beforeAll(async () => {
    newUser = {
      id: "",
      username: "test42891",
      email: "tes234891@gmail.com",
      age: 1,
      password: "test12345",
    };
    const response = await request(app).post("/api/users/signup").send(newUser);
    newUser = response.body.newUser;
  });
  afterAll(async () => {
    await request(app).delete(`/api/users/delete/${newUser.id}`);
  });
  describe("createUser", () => {
    test("should create a user", async () => {
      const response = await request(app)
        .post("/api/users/signup")
        .send(newUser);
      newUser = response.body.newUser;
      expect(response.statusCode).toBe(200);
    });
    test("should delete a user", async () => {
      const response = await request(app).delete(
        `/api/users/delete/${newUser.id}`
      );
      expect(response.statusCode).toBe(200);
    });
  });
});
