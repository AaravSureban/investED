import { useState, React } from 'react';
import StockComboBox from '../StockView';
import GraphComponent from '../GraphPage';
import PerplexityChat from "../PerplexityChat";

export const Portfolio = () => {
    const [activeStocks, setActiveStocks] = useState([]);

    return (
        <div className="flex flex-col h-screen p-4 space-y-6">
            {/* Top Section: Stock List and Graph Side-by-Side */}
            <div className="flex flex-row w-full">
                {/* Left Side: Stock List */}
                <div className="w-1/4 flex flex-col space-y-4">
                    <StockComboBox onActiveStocksChange={setActiveStocks} />
                </div>

                {/* Right Side: Graph */}
                <div className="w-3/4 flex items-start justify-center">
                    <GraphComponent />
                </div>
            </div>

            {/* Bottom Section: PerplexityChat */}
            <div className="w-full">
                <PerplexityChat activeStocks={activeStocks} />
            </div>
        </div>
    );
};

export default Portfolio;
