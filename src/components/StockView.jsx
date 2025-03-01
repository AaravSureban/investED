import { useState } from "react";
import StockComboBox from "./StockComboBox";

export const StockView = () => {
  const [selectedStocks, setSelectedStocks] = useState([]); // List of selected stocks

  const availableStocks = [
    "AAPL", "GOOGL", "TSLA", "MSFT", "AMZN", "NVDA", "META", "NFLX", "DIS", "AMD"
  ];

  // Handle stock selection
  const handleSelectStock = (stock) => {
    setSelectedStocks([...selectedStocks, stock]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Stock Portfolio</h1>

      {/* Selected Stocks List */}
      <div className="mt-6 w-64">
        <h2 className="text-lg font-semibold">Your Stocks:</h2>
        <StockComboBox stocks={availableStocks} onSelect={handleSelectStock} />
        <ul className="mt-2">
          {selectedStocks.map((stock, index) => (
            <li key={index} className="bg-gray-700 p-2 mt-1 rounded">
              {stock}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockView;
