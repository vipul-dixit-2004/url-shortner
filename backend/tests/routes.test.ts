import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("GET /", () => {
    it("should return Hello World", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.text).toBe("Hello World!");
    });
});

describe("POST /url/create", () => {
    it("should return 400 if url is missing", async () => {
        const res = await request(app)
            .post("/url/create")
            .send({});
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("URL is required");
    });

    it("should return 400 if url is an empty string", async () => {
        const res = await request(app)
            .post("/url/create")
            .send({ url: "" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("URL is required");
    });
});
