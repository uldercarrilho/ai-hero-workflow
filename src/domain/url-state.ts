import { getCatalog } from "./conversion";
import type { PairedConversion } from "./conversion";

export interface DeserializedConversion {
  conversion: PairedConversion;
  drivingSide: "left" | "right";
  drivingValue: string;
}

export function serializeConversion(
  conversion: PairedConversion,
  drivingSide: "left" | "right",
  drivingValue: string,
): string {
  const params = new URLSearchParams();
  params.set("q", conversion.quantity);
  params.set("lu", conversion.left.unit);
  params.set("ru", conversion.right.unit);
  params.set("v", drivingValue);
  params.set("d", drivingSide === "left" ? "l" : "r");
  return "?" + params.toString();
}

export function deserializeConversion(
  searchString: string,
): DeserializedConversion | null {
  const raw = searchString.startsWith("?") ? searchString.slice(1) : searchString;
  if (!raw) return null;

  const params = new URLSearchParams(raw);
  const quantityName = params.get("q");
  const leftUnit = params.get("lu");
  const rightUnit = params.get("ru");
  const drivingValue = params.get("v") ?? "";
  const drivingRaw = params.get("d");

  if (!quantityName || !leftUnit || !rightUnit) return null;
  if (drivingRaw !== "l" && drivingRaw !== "r") return null;

  const catalog = getCatalog();
  const quantity = catalog.find((q) => q.name === quantityName);
  if (!quantity) return null;

  const leftUnitDef = quantity.units.find((u) => u.name === leftUnit);
  const rightUnitDef = quantity.units.find((u) => u.name === rightUnit);
  if (!leftUnitDef || !rightUnitDef) return null;

  return {
    conversion: {
      quantity: quantityName,
      left: { unit: leftUnit, symbol: leftUnitDef.symbol, value: "" },
      right: { unit: rightUnit, symbol: rightUnitDef.symbol, value: "" },
    },
    drivingSide: drivingRaw === "l" ? "left" : "right",
    drivingValue,
  };
}
