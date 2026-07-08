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

type QuantityConversions = Record<string, number>;

const LENGTH_CONVERSIONS: QuantityConversions = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
};

const LENGTH_UNITS: Unit[] = [
  { name: "millimeter", symbol: "mm" },
  { name: "centimeter", symbol: "cm" },
  { name: "meter", symbol: "m" },
  { name: "kilometer", symbol: "km" },
  { name: "inch", symbol: "in" },
  { name: "foot", symbol: "ft" },
  { name: "yard", symbol: "yd" },
  { name: "mile", symbol: "mi" },
];

const MASS_CONVERSIONS: QuantityConversions = {
  milligram: 0.000001,
  gram: 0.001,
  kilogram: 1,
  ounce: 0.028349523125,
  pound: 0.45359237,
};

const MASS_UNITS: Unit[] = [
  { name: "milligram", symbol: "mg" },
  { name: "gram", symbol: "g" },
  { name: "kilogram", symbol: "kg" },
  { name: "ounce", symbol: "oz" },
  { name: "pound", symbol: "lb" },
];

const VOLUME_CONVERSIONS: QuantityConversions = {
  milliliter: 0.001,
  liter: 1,
  "US fluid ounce": 0.0295735295625,
  "US cup": 0.2365882365,
  "US pint": 0.473176473,
  "US quart": 0.946352946,
  "US gallon": 3.785411784,
};

const VOLUME_UNITS: Unit[] = [
  { name: "milliliter", symbol: "mL" },
  { name: "liter", symbol: "L" },
  { name: "US fluid ounce", symbol: "fl oz" },
  { name: "US cup", symbol: "cup" },
  { name: "US pint", symbol: "pt" },
  { name: "US quart", symbol: "qt" },
  { name: "US gallon", symbol: "gal" },
];

const catalog: Quantity[] = [
  {
    name: "length",
    units: LENGTH_UNITS,
    defaultPair: [
      { name: "kilometer", symbol: "km" },
      { name: "mile", symbol: "mi" },
    ],
  },
  {
    name: "mass",
    units: MASS_UNITS,
    defaultPair: [
      { name: "kilogram", symbol: "kg" },
      { name: "pound", symbol: "lb" },
    ],
  },
  {
    name: "volume",
    units: VOLUME_UNITS,
    defaultPair: [
      { name: "liter", symbol: "L" },
      { name: "US gallon", symbol: "gal" },
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

export function getQuantityDefault(quantityName: string): [Unit, Unit] {
  const quantity = catalog.find((q) => q.name === quantityName);
  if (!quantity) throw new Error(`Unknown quantity: ${quantityName}`);
  return quantity.defaultPair;
}

export function getUnitsForQuantity(quantityName: string): Unit[] {
  const quantity = catalog.find((q) => q.name === quantityName);
  if (!quantity) throw new Error(`Unknown quantity: ${quantityName}`);
  return quantity.units;
}

export function swapConversion(pc: PairedConversion): PairedConversion {
  return {
    quantity: pc.quantity,
    left: pc.right,
    right: pc.left,
  };
}

export function getDisplayPrecision(value: string): number {
  const dotIndex = value.indexOf(".");
  if (dotIndex === -1) return 0;
  return value.length - dotIndex - 1;
}

function getConversions(quantityName: string): QuantityConversions {
  if (quantityName === "length") return LENGTH_CONVERSIONS;
  if (quantityName === "mass") return MASS_CONVERSIONS;
  if (quantityName === "volume") return VOLUME_CONVERSIONS;
  throw new Error(`Unknown quantity: ${quantityName}`);
}

export function convertValueInQuantity(
  value: string,
  fromUnit: string,
  toUnit: string,
  quantityName: string,
): { computedValue: string; error: string | null } {
  const trimmed = value.trim();
  if (trimmed === "") {
    return { computedValue: "", error: null };
  }

  const num = Number(trimmed);
  if (!isFinite(num)) {
    return { computedValue: "", error: "Invalid value" };
  }

  const conversions = getConversions(quantityName);
  const fromFactor = conversions[fromUnit];
  const toFactor = conversions[toUnit];
  if (fromFactor === undefined) throw new Error(`Unknown unit: ${fromUnit}`);
  if (toFactor === undefined) throw new Error(`Unknown unit: ${toUnit}`);

  const factor = fromFactor / toFactor;
  const precision = getDisplayPrecision(value);
  const result = num * factor;
  return { computedValue: formatValue(result, precision), error: null };
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