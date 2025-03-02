import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Array of colors for different stock lines
const CHART_COLORS = [
  "#2563eb", // Blue
  "#dc2626", // Red
  "#16a34a", // Green
  "#d97706", // Amber
  "#7c3aed", // Purple
];

const TopMovers = () => {
  const [topMovers, setTopMovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keeps track of which tickers have been selected
  const [selectedStocks, setSelectedStocks] = useState([]);

  // Keeps chart data for each ticker
  // {
  //   'AAPL': [ { date: '2023-01-01', price: 100 }, ... ],
  //   'TSLA': [ { date: '2023-01-01', price: 200 }, ... ],
  // }
  const [chartDataMap, setChartDataMap] = useState({});

  // Loading states for individual stock charts
  // e.g. { 'AAPL': true, 'TSLA': false }
  const [chartLoading, setChartLoading] = useState({});

  // Cache of company names for tickers
  // e.g. { 'AAPL': 'Apple Inc.', 'TSLA': 'Tesla Inc.' }
  const [companyNames, setCompanyNames] = useState({});

  // Combined data for Recharts (array of objects).
  const [combinedChartData, setCombinedChartData] = useState([]);

  useEffect(() => {
    // Fetch top movers data on mount
    fetch("http://127.0.0.1:5000/api/top-movers")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          processTopMovers(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch top movers.");
        setLoading(false);
      });
  }, []);

  // Whenever 'selectedStocks' or 'chartDataMap' changes,
  // recompute the merged data for the chart.
  useEffect(() => {
    if (!selectedStocks.length) {
      setCombinedChartData([]);
      return;
    }
    // Merge all chart data from the selected tickers by their dates
    setCombinedChartData(combineChartData(selectedStocks, chartDataMap));
  }, [selectedStocks, chartDataMap]);

  const processTopMovers = (data) => {
    // Combine all categories of top movers into a single array
    let allStocks = [
      ...data.most_active,
      ...data.top_gainers,
      ...data.top_losers,
    ];

    // Remove duplicates by ticker
    const uniqueByTicker = {};
    allStocks.forEach((stock) => {
      uniqueByTicker[stock.ticker] = stock;
    });

    // Sort by largest absolute percentage change
    const sorted = Object.values(uniqueByTicker).sort(
      (a, b) =>
        Math.abs(parseFloat(b.change_percentage)) -
        Math.abs(parseFloat(a.change_percentage))
    );

    // Take top 5
    const top5 = sorted.slice(0, 5);
    setTopMovers(top5);

    // Pre-fetch company names for those top 5
    top5.forEach((stock) => {
      fetch(`http://127.0.0.1:5000/api/company-info/${stock.ticker}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            setCompanyNames((prev) => ({
              ...prev,
              [stock.ticker]: data.name,
            }));
          }
        })
        .catch((err) => {
          console.error(`Failed to fetch name for ${stock.ticker}`, err);
        });
    });
  };

  // Called when a stock is clicked in the list
  const handleStockClick = (stock) => {
    const ticker = stock.ticker;
    // If it's already selected, remove it
    if (selectedStocks.includes(ticker)) {
      setSelectedStocks((prev) => prev.filter((t) => t !== ticker));
      return;
    }
    // Otherwise, add it to selection
    setSelectedStocks((prev) => [...prev, ticker]);

    // If we don't have chart data yet, fetch it
    if (!chartDataMap[ticker]) {
      setChartLoading((prev) => ({ ...prev, [ticker]: true }));
      fetch(`http://127.0.0.1:5000/api/stock-chart/${ticker}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            // Save the chart data for this ticker
            setChartDataMap((prevMap) => ({
              ...prevMap,
              [ticker]: data.chart_data,
            }));
          }
          setChartLoading((prev) => ({ ...prev, [ticker]: false }));
        })
        .catch(() => {
          setError(`Failed to fetch chart data for ${ticker}.`);
          setChartLoading((prev) => ({ ...prev, [ticker]: false }));
        });
    }

    // Fetch the company name if we don't have it yet
    if (!companyNames[ticker]) {
      fetch(`http://127.0.0.1:5000/api/company-info/${ticker}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.name) {
            setCompanyNames((prev) => ({
              ...prev,
              [ticker]: data.name,
            }));
          }
        })
        .catch((err) => {
          console.error(`Failed to fetch company name for ${ticker}`, err);
        });
    }
  };

  // Helper to merge chart data across multiple tickers by date
  const combineChartData = (tickers, dataMap) => {
    // Collect all dates from all selected tickers
    const allDates = new Set();
    tickers.forEach((ticker) => {
      const stockData = dataMap[ticker] || [];
      stockData.forEach((item) => {
        allDates.add(item.date);
      });
    });

    // Sort the dates
    const sortedDates = Array.from(allDates).sort();

    // Build an array of objects, one object per date
    // with each selected ticker’s price under { [ticker]: price }
    return sortedDates.map((date) => {
      const row = { date };
      tickers.forEach((ticker) => {
        const stockDataForTicker = dataMap[ticker] || [];
        const match = stockDataForTicker.find((item) => item.date === date);
        if (match) {
          row[ticker] = match.price;
        }
      });
      return row;
    });
  };

  // Utility to format percentages with a + sign for positives
  const formatPercentage = (percentStr) => {
    const percent = parseFloat(percentStr);
    if (Number.isNaN(percent)) return percentStr;
    return percent >= 0 ? `+${percentStr}` : percentStr;
  };

  // Text color depending on up/down movement
  const getColorForStock = (percentStr) => {
    const percent = parseFloat(percentStr);
    if (Number.isNaN(percent)) return "text-gray-600";
    return percent >= 0 ? "text-green-600" : "text-red-600";
  };

  // Check if a ticker is in the selected list
  const isStockSelected = (ticker) => {
    return selectedStocks.includes(ticker);
  };

  // Assign each selected ticker a line color, based on order selected
  const getChartColor = (ticker) => {
    const index = selectedStocks.indexOf(ticker);
    return CHART_COLORS[index % CHART_COLORS.length];
  };

  // A simple way to clear all selected
  const clearAllSelections = () => {
    setSelectedStocks([]);
  };

  if (loading) return <p className="text-center p-4">Loading top movers...</p>;
  if (error) return <p className="text-center p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Top 5 Market Movers</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left side: List of top movers */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Biggest Movers Today</h3>
            {selectedStocks.length > 0 && (
              <button
                className="text-sm text-gray-500 underline"
                onClick={clearAllSelections}
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {topMovers.map((stock, index) => (
              <div
                key={index}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  isStockSelected(stock.ticker)
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleStockClick(stock)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{stock.ticker}</span>
                  <span className={getColorForStock(stock.change_percentage)}>
                    {formatPercentage(stock.change_percentage)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{stock.price}</div>
                {companyNames[stock.ticker] && (
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {companyNames[stock.ticker]}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Click a stock to add or remove it from the chart.
          </div>
        </div>

        {/* Right side: Chart */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          {selectedStocks.length > 0 ? (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Comparative Price Chart
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStocks.map((ticker) => {
                    // We can’t use the topMovers data to get the change_percentage,
                    // because it might not be in topMovers after we unify. 
                    // If you want each line’s current change%, store it in state or fetch it.
                    // Here, we’ll do the same approach you had if the ticker matches topMovers
                    const found = topMovers.find((s) => s.ticker === ticker);
                    const changePerc = found ? found.change_percentage : "0";

                    return (
                      <div
                        key={ticker}
                        className="flex items-center bg-gray-100 px-2 py-1 rounded"
                        style={{
                          borderLeft: `4px solid ${getChartColor(ticker)}`,
                        }}
                      >
                        <span className="font-medium mr-1">{ticker}</span>
                        <span className={getColorForStock(changePerc)}>
                          {formatPercentage(changePerc)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* If any chart data is still loading, show a simple spinner */}
              {Object.values(chartLoading).some(Boolean) ? (
                <p className="text-center p-8">Loading chart data...</p>
              ) : combinedChartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={combinedChartData}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getMonth() + 1}/${date.getDate()}`;
                        }}
                      />
                      <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name) => [
                          `$${parseFloat(value).toFixed(2)}`,
                          companyNames[name] || name,
                        ]}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString()
                        }
                        contentStyle={{
                          backgroundColor: "#282828",
                          color: "white",
                          border: "none",
                        }}
                      />
                      <Legend formatter={(value) => companyNames[value] || value} />
                      {selectedStocks.map((ticker) => (
                        <Line
                          key={ticker}
                          type="monotone"
                          dataKey={ticker}
                          stroke={getChartColor(ticker)}
                          activeDot={{ r: 8 }}
                          name={ticker}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center p-8">No chart data available</p>
              )}
            </div>
          ) : (
            <p className="text-center p-8">
              Select one or more stocks to view their charts
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;