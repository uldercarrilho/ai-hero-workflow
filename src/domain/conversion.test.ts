import { describe, it, expect } from "vitest";
import { getDefaultConversion, getCatalog, convertValue, getDisplayPrecision } from "./conversion";

describe("default conversion", () => {
  it("returns length quantity with kilometers and miles when state is empty", () => {
    const conversion = getDefaultConversion();

    expect(conversion).toEqual({
      quantity: "length",
      left: { unit: "kilometer", symbol: "km", value: "" },
      right: { unit: "mile", symbol: "mi", value: "" },
    });
  });
});

describe("catalog", () => {
  it("exposes length with kilometer and mile", () => {
    const catalog = getCatalog();
    const length = catalog.find((q) => q.name === "length");

    expect(length).toBeDefined();
    expect(length!.units).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "kilometer", symbol: "km" }),
        expect.objectContaining({ name: "mile", symbol: "mi" }),
      ]),
    );
  });
});

describe("getDisplayPrecision", () => {
  it("returns 0 for integer values", () => {
    expect(getDisplayPrecision("1")).toBe(0);
    expect(getDisplayPrecision("100")).toBe(0);
    expect(getDisplayPrecision("0")).toBe(0);
  });

  it("returns decimal count for fractional values", () => {
    expect(getDisplayPrecision("1.5")).toBe(1);
    expect(getDisplayPrecision("1.50")).toBe(2);
    expect(getDisplayPrecision("1.500")).toBe(3);
  });

  it("returns 0 for empty string", () => {
    expect(getDisplayPrecision("")).toBe(0);
  });
});

describe("convertValue", () => {
  it("converts kilometer to mile", () => {
    const result = convertValue("1", "kilometer", "mile");
    expect(result.computedValue).toBe("1");
    expect(result.error).toBeNull();
  });

  it("converts mile to kilometer", () => {
    const result = convertValue("1", "mile", "kilometer");
    expect(result.computedValue).toBe("2");
    expect(result.error).toBeNull();
  });

  it("returns empty for empty input", () => {
    const result = convertValue("", "kilometer", "mile");
    expect(result.computedValue).toBe("");
    expect(result.error).toBeNull();
  });

  it("returns error for invalid input", () => {
    const result = convertValue("abc", "kilometer", "mile");
    expect(result.error).toBe("Invalid value");
    expect(result.computedValue).toBe("");
  });

  it("returns error for NaN input", () => {
    const result = convertValue("1.2.3", "kilometer", "mile");
    expect(result.error).toBe("Invalid value");
  });

  it("matches precision of driving value (km to mi)", () => {
    const result = convertValue("1.5", "kilometer", "mile");
    expect(result.computedValue).toBe("0.9");
    expect(result.error).toBeNull();
  });

  it("matches precision of driving value (mi to km)", () => {
    const result = convertValue("1.00", "mile", "kilometer");
    expect(result.computedValue).toBe("1.61");
    expect(result.error).toBeNull();
  });

  it("returns identity for same unit", () => {
    const result = convertValue("5.5", "kilometer", "kilometer");
    expect(result.computedValue).toBe("5.5");
    expect(result.error).toBeNull();
  });

  it("preserves full precision of driving value (0 decimals) in computed side", () => {
    const result = convertValue("10", "kilometer", "mile");
    expect(result.computedValue).toBe("6");
    expect(result.error).toBeNull();
  });
});
