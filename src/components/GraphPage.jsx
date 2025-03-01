import React, { useEffect, useState, useRef } from "react";
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

// Map time ranges to approximate number of data points to show
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

export const ChartComponent = () => {
    const [stockSymbol, setStockSymbol] = useState("AAPL");
    const [timeRange, setTimeRange] = useState("6mo");
    const [sliderValue, setSliderValue] = useState("4"); // Default to 6mo (index 4)
    const [fullData, setFullData] = useState({ labels: [], prices: [] });
    const [displayedChartData, setDisplayedChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [dataReady, setDataReady] = useState(false);
    const [error, setError] = useState(null);
    
    // Fetch all historical data at once
    const fetchFullStockData = (symbol) => {
        setLoading(true);
        setDataReady(false);
        setError(null);

        fetch(`http://127.0.0.1:5000/stock_data?stock=${symbol}&range=max`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Stock not found: ${symbol}`);
                }
                return response.json();
            })
            .then(data => {
                // Store the complete dataset
                setFullData({
                    labels: data.labels,
                    prices: data.prices
                });
                
                // Update the displayed portion based on current timeRange
                updateDisplayedData(data.labels, data.prices, timeRange);
                setLoading(false);
                // Mark data as ready only after everything is processed
                setDataReady(true);
            })
            .catch(error => {
                console.error("Error fetching stock data:", error);
                setError(error.message);
                setLoading(false);
            });
    };

    // Function to update displayed data without fetching
    const updateDisplayedData = (allLabels, allPrices, range) => {
        // Calculate how many data points to show based on the selected time range
        const pointsToShow = timeRangeToDataPoints[range];
        
        // Get the last N data points based on the time range
        const endIndex = allLabels.length;
        const startIndex = Math.max(0, endIndex - pointsToShow);
        
        const selectedLabels = allLabels.slice(startIndex, endIndex);
        const selectedPrices = allPrices.slice(startIndex, endIndex);
        
        // Determine if price went up or down in the selected range
        const firstPrice = selectedPrices[0];
        const lastPrice = selectedPrices[selectedPrices.length - 1];
        const colorScheme = firstPrice < lastPrice ? "rgb(147, 196, 139)" : "rgb(255, 99, 132)";
        
        setDisplayedChartData({
            labels: selectedLabels,
            datasets: [
                {
                    label: `Stock Price (${stockSymbol.toUpperCase()})`,
                    data: selectedPrices,
                    borderColor: colorScheme,
                    backgroundColor: colorScheme,
                    tension: 0,
                    borderWidth: 2,
                    pointRadius: .5,
                },
            ],
        });
    };

    // Fetch full data when component mounts or stock symbol changes
    useEffect(() => {
        fetchFullStockData(stockSymbol);
    }, [stockSymbol]);

    // Handle time range changes using existing data
    useEffect(() => {
        if (fullData.labels.length > 0 && fullData.prices.length > 0) {
            updateDisplayedData(fullData.labels, fullData.prices, timeRange);
        }
    }, [timeRange, fullData]);

    const handleSearch = (e) => {
        e.preventDefault();
        const inputSymbol = e.target.stock.value.trim().toUpperCase();
        if (inputSymbol && inputSymbol !== stockSymbol) {
            setStockSymbol(inputSymbol);
        }
    };

    // Handle slider change - this will only update UI without API calls
    const handleSliderChange = (e) => {
        const newValue = e.target.value;
        setSliderValue(newValue);
        setTimeRange(timeRanges[newValue]);
    };

    return (
        <div style={{ width: "1000px", position: "relative", top: "-100px", margin: "auto", textAlign: "center" }}>
            <h2>Stock Price Chart</h2>

            {/* Stock Search Form */}
            <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
                <input type="text" name="stock" placeholder="Enter stock symbol (e.g., TSLA)" required />
                <button type="submit">Search</button>
            </form>

            {/* Time Range Slider */}
            <div style={{ marginBottom: "20px" }}>
                <label>Time Range: {timeRange}</label>
                <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={sliderValue}
                    onChange={handleSliderChange}
                    disabled={loading} // Disable slider while loading
                />
                <div>
                    <span>5 Days</span> &nbsp;&nbsp;
                    <span>1 Month</span> &nbsp;&nbsp;
                    <span>3 Months</span> &nbsp;&nbsp;
                    <span>6 Months</span> &nbsp;&nbsp;
                    <span>1 Year</span> &nbsp;&nbsp;
                    <span>2 Years</span> &nbsp;&nbsp;
                    <span>5 Years</span> &nbsp;&nbsp;
                    <span>Max</span>
                </div>
            </div>

            {/* Show Error Message if Stock Not Found */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Loading State */}
            {loading && (
                <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p>Loading all historical data...</p>
                </div>
            )}

            {/* Chart only renders when data is fully ready */}
            {!loading && dataReady && (
                <Line 
                    data={displayedChartData} 
                    options={{
                        responsive: true,
                        animation: {
                            duration: 300,
                            easing: "easeOutQuad",
                        },
                        elements: {
                            line: {
                                tension: 0.3,
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    maxTicksLimit: 10, // Limit x-axis labels to prevent crowding
                                    maxRotation: 45,
                                    minRotation: 45,
                                }
                            }
                        }
                    }} 
                />
            )}
        </div>
    );
};

export default ChartComponent;