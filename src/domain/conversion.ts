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
