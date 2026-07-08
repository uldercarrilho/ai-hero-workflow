import { describe, it, expect } from "vitest";
import { serializeConversion, deserializeConversion } from "./url-state";
import type { PairedConversion } from "./conversion";

describe("serializeConversion", () => {
  it("encodes quantity, units, value, and driving side into a search string", () => {
    const conversion: PairedConversion = {
      quantity: "length",
      left: { unit: "kilometer", symbol: "km", value: "" },
      right: { unit: "mile", symbol: "mi", value: "" },
    };
    const result = serializeConversion(conversion, "left", "10");
    expect(result).toBe("?q=length&lu=kilometer&ru=mile&v=10&d=l");
  });
});

describe("deserializeConversion", () => {
  it("restores a valid conversion from a search string", () => {
    const result = deserializeConversion("?q=length&lu=kilometer&ru=mile&v=10&d=l");
    expect(result).not.toBeNull();
    expect(result!.conversion.quantity).toBe("length");
    expect(result!.conversion.left.unit).toBe("kilometer");
    expect(result!.conversion.left.symbol).toBe("km");
    expect(result!.conversion.right.unit).toBe("mile");
    expect(result!.conversion.right.symbol).toBe("mi");
    expect(result!.conversion.left.value).toBe("");
    expect(result!.conversion.right.value).toBe("");
    expect(result!.drivingSide).toBe("left");
    expect(result!.drivingValue).toBe("10");
  });

  it("round-trips serialize -> deserialize preserves state", () => {
    const conversion: PairedConversion = {
      quantity: "mass",
      left: { unit: "kilogram", symbol: "kg", value: "" },
      right: { unit: "pound", symbol: "lb", value: "" },
    };
    const search = serializeConversion(conversion, "right", "5");
    const result = deserializeConversion(search);
    expect(result).not.toBeNull();
    expect(result!.conversion.quantity).toBe("mass");
    expect(result!.conversion.left.unit).toBe("kilogram");
    expect(result!.conversion.left.symbol).toBe("kg");
    expect(result!.conversion.right.unit).toBe("pound");
    expect(result!.conversion.right.symbol).toBe("lb");
    expect(result!.drivingSide).toBe("right");
    expect(result!.drivingValue).toBe("5");
  });

  it("handles value-less URL (no v param)", () => {
    const result = deserializeConversion("?q=length&lu=kilometer&ru=mile&d=l");
    expect(result).not.toBeNull();
    expect(result!.drivingValue).toBe("");
  });

  it("returns null for unknown quantity", () => {
    const result = deserializeConversion("?q=unknown&lu=meter&ru=foot&v=10&d=l");
    expect(result).toBeNull();
  });

  it("returns null for unknown left unit", () => {
    const result = deserializeConversion("?q=length&lu=parsec&ru=mile&v=10&d=l");
    expect(result).toBeNull();
  });

  it("returns null for unknown right unit", () => {
    const result = deserializeConversion("?q=length&lu=meter&ru=furlong&v=10&d=l");
    expect(result).toBeNull();
  });

  it("returns null for invalid driving side", () => {
    const result = deserializeConversion("?q=length&lu=meter&ru=foot&v=10&d=x");
    expect(result).toBeNull();
  });

  it("returns null for empty search string", () => {
    expect(deserializeConversion("")).toBeNull();
  });

  it("returns null for missing quantity param", () => {
    const result = deserializeConversion("?lu=meter&ru=foot&v=10&d=l");
    expect(result).toBeNull();
  });

  it("returns null for missing unit param", () => {
    const result = deserializeConversion("?q=length&ru=foot&v=10&d=l");
    expect(result).toBeNull();
  });
});
