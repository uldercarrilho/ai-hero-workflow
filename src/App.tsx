import { getDefaultConversion } from "./domain/conversion";
import "./App.css";

const conversion = getDefaultConversion();

function App() {
  return (
    <div className="converter">
      <h1>{conversion.quantity} conversion</h1>
      <div className="paired-conversion">
        <div className="side">
          <label>{conversion.left.symbol}</label>
          <input type="text" value={conversion.left.value} readOnly />
        </div>
        <div className="side">
          <label>{conversion.right.symbol}</label>
          <input type="text" value={conversion.right.value} readOnly />
        </div>
      </div>
    </div>
  );
}

export default App;
