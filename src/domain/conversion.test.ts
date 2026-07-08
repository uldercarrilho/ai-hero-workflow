import { describe, it, expect } from "vitest";
import { getDefaultConversion, getCatalog } from "./conversion";

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
