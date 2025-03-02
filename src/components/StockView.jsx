import { useState } from "react";
import StockComboBox from "./StockComboBox";

export const StockView = () => {
  const [selectedStocks, setSelectedStocks] = useState([]); // List of selected stocks

  const availableStocks = [
    "AAPL", "GOOGL", "TSLA", "MSFT", "AMZN", "NVDA", "META", "NFLX", "DIS", "AMD", "asd"
  ];

  // Handle stock selection
  const handleSelectStock = (stock) => {
    setSelectedStocks([...selectedStocks, stock]);
  };

  return (
    <div>
      {/* Selected Stocks List */}
      <div className="mt-16 w-64 min-h-30 bg-[#3d3d3d] rounded-md">
        <h2 className="text-lg font-semibold text-[#F7EBE8]">Your Stocks:</h2>
        <StockComboBox stocks={availableStocks} onSelect={handleSelectStock} />
        
      </div>
    </div>
  );
};

export default StockView;
