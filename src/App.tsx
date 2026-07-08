import { useState, useCallback, useEffect } from "react";
import {
  getDefaultConversion,
  getCatalog,
  getUnitsForQuantity,
  getQuantityDefault,
  convertValueInQuantity,
  swapConversion,
} from "./domain/conversion";
import { serializeConversion, deserializeConversion } from "./domain/url-state";
import type { PairedConversion } from "./domain/conversion";
import "./App.css";

function App() {
  const [conversion, setConversion] = useState<PairedConversion>(getDefaultConversion);
  const [leftValue, setLeftValue] = useState("");
  const [rightValue, setRightValue] = useState("");
  const [leftError, setLeftError] = useState<string | null>(null);
  const [rightError, setRightError] = useState<string | null>(null);
  const [drivingSide, setDrivingSide] = useState<"left" | "right">("left");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const search = window.location.search;
    if (search) {
      const result = deserializeConversion(search);
      if (result) {
        const { conversion: c, drivingSide: d, drivingValue: v } = result;
        setConversion(c);
        setDrivingSide(d);
        if (v !== "") {
          const fromUnit = d === "left" ? c.left.unit : c.right.unit;
          const toUnit = d === "left" ? c.right.unit : c.left.unit;
          const computed = convertValueInQuantity(v, fromUnit, toUnit, c.quantity);
          if (d === "left") {
            setLeftValue(v);
            if (!computed.error) setRightValue(computed.computedValue);
          } else {
            setRightValue(v);
            if (!computed.error) setLeftValue(computed.computedValue);
          }
        }
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const drivingValue = drivingSide === "left" ? leftValue : rightValue;
    const search = serializeConversion(conversion, drivingSide, drivingValue);
    window.history.replaceState(null, "", search);
  }, [conversion, drivingSide, leftValue, rightValue, initialized]);

  const catalog = getCatalog();
  const currentUnits = getUnitsForQuantity(conversion.quantity);

  const handleLeftChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLeftValue(newValue);
      setDrivingSide("left");

      const result = convertValueInQuantity(newValue, conversion.left.unit, conversion.right.unit, conversion.quantity);
      if (result.error) {
        setLeftError(result.error);
      } else {
        setLeftError(null);
        setRightError(null);
        setRightValue(result.computedValue);
      }
    },
    [conversion.left.unit, conversion.right.unit, conversion.quantity],
  );

  const handleRightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setRightValue(newValue);
      setDrivingSide("right");

      const result = convertValueInQuantity(newValue, conversion.right.unit, conversion.left.unit, conversion.quantity);
      if (result.error) {
        setRightError(result.error);
      } else {
        setRightError(null);
        setLeftError(null);
        setLeftValue(result.computedValue);
      }
    },
    [conversion.right.unit, conversion.left.unit, conversion.quantity],
  );

  const handleLeftUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newUnitName = e.target.value;
      const newUnit = currentUnits.find((u) => u.name === newUnitName)!;
      setConversion((prev) => ({
        ...prev,
        left: { ...prev.left, unit: newUnitName, symbol: newUnit.symbol },
      }));
      if (drivingSide === "left" && leftValue !== "") {
        const result = convertValueInQuantity(leftValue, newUnitName, conversion.right.unit, conversion.quantity);
        if (result.error) {
          setLeftError(result.error);
        } else {
          setLeftError(null);
          setRightError(null);
          setRightValue(result.computedValue);
        }
      } else if (drivingSide === "right" && rightValue !== "") {
        const result = convertValueInQuantity(rightValue, conversion.right.unit, newUnitName, conversion.quantity);
        if (result.error) {
          setRightError(result.error);
        } else {
          setRightError(null);
          setLeftError(null);
          setLeftValue(result.computedValue);
        }
      }
    },
    [currentUnits, conversion.right.unit, conversion.quantity, drivingSide, leftValue, rightValue],
  );

  const handleRightUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newUnitName = e.target.value;
      const newUnit = currentUnits.find((u) => u.name === newUnitName)!;
      setConversion((prev) => ({
        ...prev,
        right: { ...prev.right, unit: newUnitName, symbol: newUnit.symbol },
      }));
      if (drivingSide === "left" && leftValue !== "") {
        const result = convertValueInQuantity(leftValue, conversion.left.unit, newUnitName, conversion.quantity);
        if (result.error) {
          setLeftError(result.error);
        } else {
          setLeftError(null);
          setRightError(null);
          setRightValue(result.computedValue);
        }
      } else if (drivingSide === "right" && rightValue !== "") {
        const result = convertValueInQuantity(rightValue, newUnitName, conversion.left.unit, conversion.quantity);
        if (result.error) {
          setRightError(result.error);
        } else {
          setRightError(null);
          setLeftError(null);
          setLeftValue(result.computedValue);
        }
      }
    },
    [currentUnits, conversion.left.unit, conversion.quantity, drivingSide, leftValue, rightValue],
  );

  const handleSwap = useCallback(() => {
    const swapped = swapConversion(conversion);
    setConversion(swapped);
    setLeftValue(rightValue);
    setRightValue(leftValue);
    setLeftError(rightError);
    setRightError(leftError);
  }, [conversion, leftValue, rightValue, leftError, rightError]);

  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newQuantityName = e.target.value;
      const defaultPair = getQuantityDefault(newQuantityName);
      setConversion({
        quantity: newQuantityName,
        left: { unit: defaultPair[0].name, symbol: defaultPair[0].symbol, value: "" },
        right: { unit: defaultPair[1].name, symbol: defaultPair[1].symbol, value: "" },
      });
      setLeftValue("");
      setRightValue("");
      setLeftError(null);
      setRightError(null);
      setDrivingSide("left");
    },
    [],
  );

  return (
    <div className="converter">
      <div className="quantity-selector">
        <label htmlFor="quantity-select">Quantity</label>
        <select
          id="quantity-select"
          value={conversion.quantity}
          onChange={handleQuantityChange}
        >
          {catalog.map((q) => (
            <option key={q.name} value={q.name}>
              {q.name}
            </option>
          ))}
        </select>
      </div>
      <h1>{conversion.quantity} conversion</h1>
      <div className="paired-conversion">
        <div className="side">
          <select value={conversion.left.unit} onChange={handleLeftUnitChange}>
            {currentUnits.map((u) => (
              <option key={u.name} value={u.name}>
                {u.symbol}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={leftValue}
            onChange={handleLeftChange}
          />
          {leftError && <span className="error">{leftError}</span>}
        </div>
        <button className="swap-button" onClick={handleSwap} aria-label="Swap units and values">
          &#8646;
        </button>
        <div className="side">
          <select value={conversion.right.unit} onChange={handleRightUnitChange}>
            {currentUnits.map((u) => (
              <option key={u.name} value={u.name}>
                {u.symbol}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={rightValue}
            onChange={handleRightChange}
          />
          {rightError && <span className="error">{rightError}</span>}
        </div>
      </div>
    </div>
  );
}

export default App;