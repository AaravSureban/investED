import React from 'react';
import StockComboBox from '../StockView';
import GraphComponent from '../GraphPage';
import PerplexityChat from "../PerplexityChat";

export const Portfolio = () => {
    return (
        <div className="flex h-screen p-4">
            {/* Left Side: Stock List (Doesn't push the graph down) */}
            <div className="w-1/4 flex flex-col space-y-4">
                <StockComboBox />
                <PerplexityChat />
            </div>

            {/* Right Side: Graph (Fixed Position) */}
            <div className="w-3/4 flex items-start justify-center">
                <GraphComponent />
            </div>
        </div>
    );
};

export default Portfolio;