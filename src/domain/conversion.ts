export interface Unit {
  name: string;
  symbol: string;
}

export interface Quantity {
  name: string;
  units: Unit[];
  defaultPair: [Unit, Unit];
}

export interface PairedConversionSide {
  unit: string;
  symbol: string;
  value: string;
}

export interface PairedConversion {
  quantity: string;
  left: PairedConversionSide;
  right: PairedConversionSide;
}

const catalog: Quantity[] = [
  {
    name: "length",
    units: [
      { name: "kilometer", symbol: "km" },
      { name: "mile", symbol: "mi" },
    ],
    defaultPair: [
      { name: "kilometer", symbol: "km" },
      { name: "mile", symbol: "mi" },
    ],
  },
];

export function getCatalog(): Quantity[] {
  return catalog;
}

export function getDefaultConversion(): PairedConversion {
  const length = catalog.find((q) => q.name === "length")!;
  return {
    quantity: "length",
    left: { unit: length.defaultPair[0].name, symbol: length.defaultPair[0].symbol, value: "" },
    right: { unit: length.defaultPair[1].name, symbol: length.defaultPair[1].symbol, value: "" },
  };
}

export function getDisplayPrecision(value: string): number {
  const dotIndex = value.indexOf(".");
  if (dotIndex === -1) return 0;
  return value.length - dotIndex - 1;
}

const KM_TO_MI = 0.621371;
const MI_TO_KM = 1.609344;

function getConversionFactor(fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return 1;
  if (fromUnit === "kilometer" && toUnit === "mile") return KM_TO_MI;
  if (fromUnit === "mile" && toUnit === "kilometer") return MI_TO_KM;
  throw new Error(`Unknown conversion from ${fromUnit} to ${toUnit}`);
}

function formatValue(value: number, precision: number): string {
  return value.toFixed(precision);
}

export function convertValue(
  value: string,
  fromUnit: string,
  toUnit: string,
): { computedValue: string; error: string | null } {
  const trimmed = value.trim();
  if (trimmed === "") {
    return { computedValue: "", error: null };
  }

  const num = Number(trimmed);
  if (!isFinite(num)) {
    return { computedValue: "", error: "Invalid value" };
  }

  const factor = getConversionFactor(fromUnit, toUnit);
  const precision = getDisplayPrecision(value);
  const result = num * factor;
  return { computedValue: formatValue(result, precision), error: null };
}
