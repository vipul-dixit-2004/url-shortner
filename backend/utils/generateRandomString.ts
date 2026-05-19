import { base64Length, base64String } from "../constants.js";

export const generateRandomString = (): string => {
    const salt = Math.floor(Math.random() * 1_000_000);
    let timestamp: bigint = BigInt(Date.now()) * 1_000_000n + BigInt(salt);
    let randomString = "";
    while (timestamp > 0) {
        const randIndex = Number(timestamp % BigInt(base64Length));
        randomString += base64String[randIndex];
        timestamp = timestamp / BigInt(base64Length);
    }
    return randomString.slice(0, 6);
};