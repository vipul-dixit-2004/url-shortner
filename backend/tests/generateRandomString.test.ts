import { describe, it, expect } from "vitest";
import { generateRandomString } from "../utils/generateRandomString.js";

describe("generateRandomString", () => {
    it("should return a non-empty string", () => {
        const result = generateRandomString();
        expect(result).toBeTruthy();
        expect(typeof result).toBe("string");
    });

    it("should only contain valid base62 characters", () => {
        const validChars = /^[A-Za-z0-9]+$/;
        const result = generateRandomString();
        expect(validChars.test(result)).toBe(true);
    });

    it("should return different values on subsequent calls", () => {
        const result1 = generateRandomString();
        const result2 = generateRandomString();
        // Extremely unlikely to be the same in the same millisecond
        expect(result1).not.toBe(result2);
    });

});
