import { describe, expect, it } from "vitest";
import { SCHOOL_RULES, TOY_RSA, biometricRates, normalCdf, backupsNeeded, caesar, charsetSize, crackTime, firstMatch, modPow, rsaApply, vigenere } from "@/lib/theory/security";

describe("caesar", () => {
  it("shifts letters and wraps around", () => {
    expect(caesar("DOG", 3)).toBe("GRJ");
    expect(caesar("xyz", 3)).toBe("abc");
    expect(caesar("FRGH", -3)).toBe("CODE");
    expect(caesar("Hi, 2!", 1)).toBe("Ij, 2!");
  });
});

describe("firewall rules", () => {
  it("uses the first rule that matches", () => {
    expect(firstMatch(SCHOOL_RULES, { port: 443, source: "Internet" })).toBe(0);
    expect(firstMatch(SCHOOL_RULES, { port: 22, source: "IT office" })).toBe(1);
    expect(firstMatch(SCHOOL_RULES, { port: 22, source: "Internet" })).toBe(3);
    expect(firstMatch(SCHOOL_RULES, { port: 3306, source: "Internet" })).toBe(2);
  });
});

describe("password strength", () => {
  it("counts the character set and grows with length", () => {
    expect(charsetSize("abc")).toBe(26);
    expect(charsetSize("aB3!")).toBe(95);
    expect(crackTime("abc")).toBe("less than a second");
    expect(crackTime("Xk9#mQ2$vL7&pR4!")).toMatch(/years/);
  });
});

describe("restoring backups", () => {
  it("needs every incremental but only the last differential", () => {
    expect(backupsNeeded("incremental", 4)).toEqual(["Sunday (full)", "Monday (incremental)", "Tuesday (incremental)", "Wednesday (incremental)"]);
    expect(backupsNeeded("differential", 4)).toEqual(["Sunday (full)", "Wednesday (differential)"]);
    expect(backupsNeeded("differential", 1)).toEqual(["Sunday (full)"]);
  });
});

describe("symmetric and asymmetric toy ciphers", () => {
  it("Vigenère: the same key encrypts and decrypts", () => {
    expect(vigenere("ATTACKATDAWN", "LEMON")).toBe("LXFOPVEFRNHR");
    expect(vigenere("Meet at noon!", "key")).toBe("Wicd er xsmx!");
    expect(vigenere(vigenere("Meet at noon!", "key"), "key", true)).toBe("Meet at noon!");
    expect(vigenere("abc", "123")).toBe("abc");
  });
  it("RSA: the public key encrypts, only the private key decrypts", () => {
    expect(modPow(65, 17, 3233)).toBe(2790);
    const codes = [..."HELLO"].map((c) => c.charCodeAt(0));
    const cipher = rsaApply(codes, TOY_RSA.e);
    expect(rsaApply(cipher, TOY_RSA.d)).toEqual(codes);
    expect(rsaApply(cipher, TOY_RSA.e)).not.toEqual(codes);
  });
});

describe("biometric threshold", () => {
  it("normal distribution", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3);
  });
  it("a stricter threshold lets fewer impostors in but rejects more genuine users", () => {
    const low = biometricRates(45);
    const high = biometricRates(75);
    expect(high.far).toBeLessThan(low.far);
    expect(high.frr).toBeGreaterThan(low.frr);
    expect(biometricRates(0).far).toBeGreaterThan(0.99);
    expect(biometricRates(100).frr).toBeGreaterThan(0.99);
  });
});
