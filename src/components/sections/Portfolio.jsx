import { useState, React, useRef } from 'react';
import { motion, useInView } from 'framer-motion'; // Import Framer Motion
import StockComboBox from '../StockView';
import GraphComponent from '../GraphPage';
import PerplexityChat from "../PerplexityChat";

export const Portfolio = () => {
    const [activeStocks, setActiveStocks] = useState([]);

    // Refs for each section
    const stockListRef = useRef(null);
    const graphRef = useRef(null);
    const chatRef = useRef(null);

    // Track when each section is in view
    const isStockListInView = useInView(stockListRef, { once: true, margin: "-100px" });
    const isGraphInView = useInView(graphRef, { once: true, margin: "-100px" });
    const isChatInView = useInView(chatRef, { once: true, margin: "-100px" });

    return (
        <div className="flex flex-col h-screen p-4 space-y-6">
            {/* Top Section: Stock List and Graph Side-by-Side */}
            <div className="flex flex-row w-full">
                {/* Left Side: Stock List */}
                <motion.div 
                    ref={stockListRef}
                    className="w-1/4 flex flex-col space-y-4"
                    initial={{ opacity: 0, x: -50 }} 
                    animate={isStockListInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }} // Faster animation
                >
                    <StockComboBox onActiveStocksChange={setActiveStocks} />
                </motion.div>

                {/* Right Side: Graph */}
                <motion.div 
                    ref={graphRef}
                    className="w-3/4 flex items-start justify-center"
                    initial={{ opacity: 0, x: 50 }} 
                    animate={isGraphInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }} // Faster & slight delay
                >
                    <GraphComponent />
                </motion.div>
            </div>

            {/* Bottom Section: PerplexityChat */}
            <motion.div 
                ref={chatRef}
                className="w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={isChatInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }} // Faster & quick delay
            >
                <PerplexityChat activeStocks={activeStocks} />
            </motion.div>
        </div>
    );
};

export default Portfolio;
