import { useState } from "react";
import { getDefaultConversion, convertValue } from "./domain/conversion";
import "./App.css";

function App() {
  const conversion = getDefaultConversion();
  const [leftValue, setLeftValue] = useState("");
  const [rightValue, setRightValue] = useState("");
  const [leftError, setLeftError] = useState<string | null>(null);
  const [rightError, setRightError] = useState<string | null>(null);

  const handleLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLeftValue(newValue);

    const result = convertValue(newValue, "kilometer", "mile");
    if (result.error) {
      setLeftError(result.error);
    } else {
      setLeftError(null);
      setRightError(null);
      setRightValue(result.computedValue);
    }
  };

  const handleRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setRightValue(newValue);

    const result = convertValue(newValue, "mile", "kilometer");
    if (result.error) {
      setRightError(result.error);
    } else {
      setRightError(null);
      setLeftError(null);
      setLeftValue(result.computedValue);
    }
  };

  return (
    <div className="converter">
      <h1>{conversion.quantity} conversion</h1>
      <div className="paired-conversion">
        <div className="side">
          <label>{conversion.left.symbol}</label>
          <input
            type="text"
            value={leftValue}
            onChange={handleLeftChange}
          />
          {leftError && <span className="error">{leftError}</span>}
        </div>
        <div className="side">
          <label>{conversion.right.symbol}</label>
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
