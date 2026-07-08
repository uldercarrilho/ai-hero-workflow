import { describe, it, expect } from "vitest";
import {
  getDefaultConversion,
  getCatalog,
  convertValue,
  getDisplayPrecision,
  swapConversion,
  convertValueInQuantity,
  getQuantityDefault,
} from "./conversion";

const LENGTH_UNITS = [
  "millimeter",
  "centimeter",
  "meter",
  "kilometer",
  "inch",
  "foot",
  "yard",
  "mile",
];

const MASS_UNITS = [
  "milligram",
  "gram",
  "kilogram",
  "ounce",
  "pound",
];

const VOLUME_UNITS = [
  "milliliter",
  "liter",
  "US fluid ounce",
  "US cup",
  "US pint",
  "US quart",
  "US gallon",
];

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
  it("exposes length with all 8 expected units", () => {
    const catalog = getCatalog();
    const length = catalog.find((q) => q.name === "length");

    expect(length).toBeDefined();
    const unitNames = length!.units.map((u) => u.name);
    expect(unitNames).toEqual(LENGTH_UNITS);
  });

  it("exposes mass with all 5 expected units", () => {
    const catalog = getCatalog();
    const mass = catalog.find((q) => q.name === "mass");

    expect(mass).toBeDefined();
    const unitNames = mass!.units.map((u) => u.name);
    expect(unitNames).toEqual(MASS_UNITS);
  });

  it("exposes volume with all 7 expected US customary units", () => {
    const catalog = getCatalog();
    const volume = catalog.find((q) => q.name === "volume");

    expect(volume).toBeDefined();
    const unitNames = volume!.units.map((u) => u.name);
    expect(unitNames).toEqual(VOLUME_UNITS);
  });

  it("each unit has a name and symbol", () => {
    const catalog = getCatalog();
    for (const q of catalog) {
      for (const u of q.units) {
        expect(u.name).toBeTruthy();
        expect(u.symbol).toBeTruthy();
      }
    }
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

describe("swapConversion", () => {
  it("swaps all fields between left and right sides", () => {
    const input = {
      quantity: "length",
      left: { unit: "kilometer", symbol: "km", value: "10" },
      right: { unit: "mile", symbol: "mi", value: "6.21371" },
    };

    const result = swapConversion(input);

    expect(result.left).toEqual({ unit: "mile", symbol: "mi", value: "6.21371" });
    expect(result.right).toEqual({ unit: "kilometer", symbol: "km", value: "10" });
  });

  it("preserves quantity field unchanged", () => {
    const input = {
      quantity: "length",
      left: { unit: "meter", symbol: "m", value: "" },
      right: { unit: "foot", symbol: "ft", value: "" },
    };

    const result = swapConversion(input);

    expect(result.quantity).toBe("length");
  });

  it("handles empty values correctly", () => {
    const input = {
      quantity: "length",
      left: { unit: "millimeter", symbol: "mm", value: "" },
      right: { unit: "inch", symbol: "in", value: "" },
    };

    const result = swapConversion(input);

    expect(result.left).toEqual({ unit: "inch", symbol: "in", value: "" });
    expect(result.right).toEqual({ unit: "millimeter", symbol: "mm", value: "" });
  });
});

describe("convertValueInQuantity", () => {
  it("converts kilometer to mile using base-unit conversion", () => {
    const result = convertValueInQuantity("1.000000", "kilometer", "mile", "length");
    expect(result.computedValue).toBe("0.621371");
    expect(result.error).toBeNull();
  });

  it("converts mile to kilometer", () => {
    const result = convertValueInQuantity("1.000000", "mile", "kilometer", "length");
    expect(result.computedValue).toBe("1.609344");
    expect(result.error).toBeNull();
  });

  it("converts meter to foot", () => {
    const result = convertValueInQuantity("1.0", "meter", "foot", "length");
    expect(result.computedValue).toBe("3.3");
    expect(result.error).toBeNull();
  });

  it("converts inch to millimeter", () => {
    const result = convertValueInQuantity("1.0", "inch", "millimeter", "length");
    expect(result.computedValue).toBe("25.4");
    expect(result.error).toBeNull();
  });

  it("converts yard to meter", () => {
    const result = convertValueInQuantity("1.00", "yard", "meter", "length");
    expect(result.computedValue).toBe("0.91");
    expect(result.error).toBeNull();
  });

  it("returns empty for empty input", () => {
    const result = convertValueInQuantity("", "kilometer", "mile", "length");
    expect(result.computedValue).toBe("");
    expect(result.error).toBeNull();
  });

  it("returns error for invalid input", () => {
    const result = convertValueInQuantity("abc", "kilometer", "mile", "length");
    expect(result.error).toBe("Invalid value");
    expect(result.computedValue).toBe("");
  });

  it("returns identity for same unit", () => {
    const result = convertValueInQuantity("5.5", "kilometer", "kilometer", "length");
    expect(result.computedValue).toBe("5.5");
    expect(result.error).toBeNull();
  });

  it("converts kilogram to pound", () => {
    const result = convertValueInQuantity("1.000000", "kilogram", "pound", "mass");
    expect(result.computedValue).toBe("2.204623");
    expect(result.error).toBeNull();
  });

  it("converts pound to kilogram", () => {
    const result = convertValueInQuantity("1.000000", "pound", "kilogram", "mass");
    expect(result.computedValue).toBe("0.453592");
    expect(result.error).toBeNull();
  });

  it("converts gram to ounce", () => {
    const result = convertValueInQuantity("100.0000", "gram", "ounce", "mass");
    expect(result.computedValue).toBe("3.5274");
    expect(result.error).toBeNull();
  });

  it("converts ounce to gram", () => {
    const result = convertValueInQuantity("1.000", "ounce", "gram", "mass");
    expect(result.computedValue).toBe("28.350");
    expect(result.error).toBeNull();
  });

  it("converts milligram to gram", () => {
    const result = convertValueInQuantity("1000.0", "milligram", "gram", "mass");
    expect(result.computedValue).toBe("1.0");
    expect(result.error).toBeNull();
  });

  it("throws error for unknown quantity", () => {
    expect(() => convertValueInQuantity("1", "unknown", "unknown", "bogus")).toThrow(
      "Unknown quantity: bogus",
    );
  });
});

describe("convertValueInQuantity volume conversions", () => {
  it("converts liter to US gallon (default pair)", () => {
    const result = convertValueInQuantity("1.000000", "liter", "US gallon", "volume");
    expect(result.computedValue).toBe("0.264172");
    expect(result.error).toBeNull();
  });

  it("converts US gallon to liter (default pair)", () => {
    const result = convertValueInQuantity("1.000000", "US gallon", "liter", "volume");
    expect(result.computedValue).toBe("3.785412");
    expect(result.error).toBeNull();
  });

  it("converts milliliter to US fluid ounce", () => {
    const result = convertValueInQuantity("100.000", "milliliter", "US fluid ounce", "volume");
    expect(result.computedValue).toBe("3.381");
    expect(result.error).toBeNull();
  });

  it("converts US quart to US cup", () => {
    const result = convertValueInQuantity("1.00", "US quart", "US cup", "volume");
    expect(result.computedValue).toBe("4.00");
    expect(result.error).toBeNull();
  });

  it("converts US pint to milliliter", () => {
    const result = convertValueInQuantity("1.000", "US pint", "milliliter", "volume");
    expect(result.computedValue).toBe("473.176");
    expect(result.error).toBeNull();
  });

  it("converts US gallon to US quart", () => {
    const result = convertValueInQuantity("1.00", "US gallon", "US quart", "volume");
    expect(result.computedValue).toBe("4.00");
    expect(result.error).toBeNull();
  });

  it("converts extreme pair: milliliter to US gallon (very small to very large)", () => {
    const result = convertValueInQuantity("1.000000", "milliliter", "US gallon", "volume");
    expect(result.computedValue).toBe("0.000264");
    expect(result.error).toBeNull();
  });

  it("converts extreme pair: US gallon to milliliter (very large to very small)", () => {
    const result = convertValueInQuantity("1.000000", "US gallon", "milliliter", "volume");
    expect(result.computedValue).toBe("3785.411784");
    expect(result.error).toBeNull();
  });
});

describe("getQuantityDefault", () => {
  it("returns mass default pair (kg, lb)", () => {
    const defaultPair = getQuantityDefault("mass");
    expect(defaultPair).toEqual([
      { name: "kilogram", symbol: "kg" },
      { name: "pound", symbol: "lb" },
    ]);
  });

  it("returns length default pair (km, mi)", () => {
    const defaultPair = getQuantityDefault("length");
    expect(defaultPair).toEqual([
      { name: "kilometer", symbol: "km" },
      { name: "mile", symbol: "mi" },
    ]);
  });

  it("returns volume default pair (liter, US gallon)", () => {
    const defaultPair = getQuantityDefault("volume");
    expect(defaultPair).toEqual([
      { name: "liter", symbol: "L" },
      { name: "US gallon", symbol: "gal" },
    ]);
  });

  it("throws error for unknown quantity", () => {
    expect(() => getQuantityDefault("unknown")).toThrow("Unknown quantity: unknown");
  });
});

describe("convertValue (legacy)", () => {
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