import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

const timeRanges = {
    1: "5d",
    2: "1mo",
    3: "3mo",
    4: "6mo",
    5: "1y",
    6: "2y",
    7: "5y",
    8: "max",
};

const timeRangeToDataPoints = {
    "5d": 5,
    "1mo": 30,
    "3mo": 90,
    "6mo": 180,
    "1y": 365,
    "2y": 365 * 2,
    "5y": 365 * 5,
    "max": Infinity
};

// Color palette for different stocks
const colorPalette = [
    "rgb(147, 196, 139)",  // Green
    "rgb(255, 99, 132)",   // Red
    "rgb(54, 162, 235)",   // Blue
    "rgb(255, 206, 86)",   // Yellow
    "rgb(153, 102, 255)",  // Purple
    "rgb(255, 159, 64)",   // Orange
    "rgb(75, 192, 192)",   // Teal
    "rgb(231, 233, 237)"   // Gray
];

export const ChartComponent = () => {
    const [selectedStocks, setSelectedStocks] = useState([{ symbol: "AAPL", active: true }]);
    const [newStockSymbol, setNewStockSymbol] = useState("");
    const [timeRange, setTimeRange] = useState("6mo");
    const [stocksData, setStocksData] = useState({});
    const [displayedChartData, setDisplayedChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [dataReady, setDataReady] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchStockData = (symbol) => {
        setLoading(true);
        setError(null);

        fetch(`http://127.0.0.1:5000/stock_data?stock=${symbol}&range=max`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Stock not found: ${symbol}`);
                }
                return response.json();
            })
            .then(data => {
                setStocksData(prevData => ({
                    ...prevData,
                    [symbol]: {
                        labels: data.labels,
                        prices: data.prices
                    }
                }));
                
                setLoading(false);
                setDataReady(true);
            })
            .catch(error => {
                console.error(`Error fetching data for ${symbol}:`, error);
                setError(error.message);
                setLoading(false);
                
                // Remove the failed stock from the selected list
                setSelectedStocks(prev => prev.filter(stock => stock.symbol !== symbol));
            });
    };

    const updateDisplayedData = () => {
        const activeStocks = selectedStocks.filter(stock => stock.active);
        if (activeStocks.length === 0 || Object.keys(stocksData).length === 0) {
            setDisplayedChartData({ labels: [], datasets: [] });
            return;
        }

        // Find the common date range or use the first stock's dates
        let commonLabels = [];
        if (activeStocks.length > 0 && stocksData[activeStocks[0].symbol]) {
            const firstStockSymbol = activeStocks[0].symbol;
            const pointsToShow = timeRangeToDataPoints[timeRange];
            const allLabels = stocksData[firstStockSymbol].labels;
            const endIndex = allLabels.length;
            const startIndex = Math.max(0, endIndex - pointsToShow);
            commonLabels = allLabels.slice(startIndex, endIndex);
        }

        const datasets = activeStocks
            .filter(stock => stocksData[stock.symbol])
            .map((stock, index) => {
                const symbol = stock.symbol;
                const pointsToShow = timeRangeToDataPoints[timeRange];
                const allLabels = stocksData[symbol].labels;
                const allPrices = stocksData[symbol].prices;
                const endIndex = allLabels.length;
                const startIndex = Math.max(0, endIndex - pointsToShow);
                
                const selectedPrices = allPrices.slice(startIndex, endIndex);
                const colorIndex = index % colorPalette.length;
                
                return {
                    label: `${symbol}`,
                    data: selectedPrices,
                    borderColor: colorPalette[colorIndex],
                    backgroundColor: colorPalette[colorIndex],
                    tension: 0,
                    borderWidth: 2,
                    pointRadius: 0.5,
                };
            });

        setDisplayedChartData({
            labels: commonLabels,
            datasets: datasets,
        });
    };

    // Initial fetch for default stock
    useEffect(() => {
        if (selectedStocks.length > 0) {
            selectedStocks.forEach(stock => {
                if (!stocksData[stock.symbol]) {
                    fetchStockData(stock.symbol);
                }
            });
        }
    }, []);

    // Update chart when stocks or time range changes
    useEffect(() => {
        if (Object.keys(stocksData).length > 0) {
            updateDisplayedData();
        }
    }, [timeRange, stocksData, selectedStocks]);

    const handleAddStock = (e) => {
        e.preventDefault();
        const symbol = newStockSymbol.trim().toUpperCase();
        
        if (!symbol) return;
        
        // Check if stock already exists
        if (!selectedStocks.some(stock => stock.symbol === symbol)) {
            setSelectedStocks(prev => [...prev, { symbol, active: true }]);
            
            // Fetch data for the new stock
            if (!stocksData[symbol]) {
                fetchStockData(symbol);
            }
        }
        
        setNewStockSymbol("");
    };

    const toggleStockVisibility = (symbol) => {
        setSelectedStocks(prev => 
            prev.map(stock => 
                stock.symbol === symbol 
                    ? { ...stock, active: !stock.active } 
                    : stock
            )
        );
    };

    const removeStock = (symbol) => {
        setSelectedStocks(prev => prev.filter(stock => stock.symbol !== symbol));
    };

    return (
        <div style={{ width: "1000px", position: "relative", top: "-100px", margin: "auto", textAlign: "center" }}>
            <form onSubmit={handleAddStock} style={{ marginBottom: "20px" }}>
                <input 
                    type="text" 
                    value={newStockSymbol} 
                    onChange={(e) => setNewStockSymbol(e.target.value)}
                    placeholder="Enter stock symbol" 
                    required
                />
                <button type="submit" className="px-4 bg-[#2E5129] rounded-md">Add Stock</button>
            </form>

            <div style={{ marginBottom: "15px" }}>
                <h3>Selected Stocks:</h3>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
                    {selectedStocks.map((stock, index) => (
                        <div 
                            key={stock.symbol} 
                            style={{ 
                                padding: "8px", 
                                margin: "5px", 
                                border: "1px solid #ccc", 
                                borderRadius: "4px",
                                backgroundColor: stock.active ? colorPalette[index % colorPalette.length] : "#f0f0f0",
                                color: stock.active ? "white" : "black",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            <span>{stock.symbol}</span>
                            <button 
                                onClick={() => toggleStockVisibility(stock.symbol)}
                                style={{ border: "none", background: "none", cursor: "pointer", padding: "2px 5px" }}
                            >
                                {stock.active ? "Hide" : "Show"}
                            </button>
                            <button 
                                onClick={() => removeStock(stock.symbol)}
                                style={{ border: "none", background: "none", cursor: "pointer", padding: "2px 5px" }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: "25px", fontWeight: "bold" }}>
                {Object.entries(timeRanges).map(([key, value]) => (
                    <button 
                        key={key} 
                        onClick={() => setTimeRange(value)} 
                        style={{ 
                            margin: "5px", 
                            padding: "8px", 
                            cursor: "pointer", 
                            color: timeRange === value ? "#8080B3" : "", 
                            fontWeight: timeRange === value ? "bold" : "normal" 
                        }}
                    >
                        {value}
                    </button>
                ))}
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Loading stock data...</p>}
            
            <div style={{ position: "relative", height: "400px" }}>
                {!loading && dataReady && selectedStocks.some(stock => stock.active) && (
                    <Line 
                        data={displayedChartData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        font: { weight: "bold" }
                                    }
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        font: { weight: "bold" }
                                    }
                                },
                                y: {
                                    ticks: {
                                        font: { weight: "bold" }
                                    }
                                }
                            },
                            interaction: {
                                mode: 'nearest',
                                axis: 'x',
                                intersect: false
                            }
                        }} 
                    />
                )}
                {(!dataReady || selectedStocks.length === 0 || !selectedStocks.some(stock => stock.active)) && (
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <p>No stocks selected to display</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartComponent;