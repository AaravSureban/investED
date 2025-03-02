import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const StockComboBox = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [stockPrice, setStockPrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const API_KEY = "cv1kgupr01qngf097ikgcv1kgupr01qngf097il0"; // Replace with your API key
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchStocks = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setSelectedStocks(userDoc.data().stocks || []);
          }
        } catch (error) {
          console.error("Error fetching stocks:", error);
        }
      };
      fetchStocks();
    }
  }, [user]);

  const fetchStocksFromAPI = async (query) => {
    if (!query) {
      setFilteredStocks([]);
      return;
    }

    try {
      const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`);
      const data = await response.json();
      const queryLower = query.toLowerCase();

      let filtered = data
        .filter(
          (stock) =>
            stock.symbol.toLowerCase().includes(queryLower) ||
            stock.description.toLowerCase().includes(queryLower))
        .slice(0, 10);

      setFilteredStocks(
        filtered.map((stock) => ({
          ticker: stock.symbol,
          fullName: stock.description,
        }))
      );
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchHistoricalPrice = async (ticker, date) => {
    try {
      setIsLoading(true);

      // Validate date format (YYYY-MM-DD)
      if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        console.error("Invalid or missing date:", date);
        return null;
      }

      // Build the URL using the provided date
      const backendUrl = "http://127.0.0.1:5000/stock_data_by_date"; // Adjust if needed
      const url = `${backendUrl}?stock=${encodeURIComponent(ticker)}&purchaseDate=${date}`;

      console.log("Fetching historical price with URL:", url); // Debug log

      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        console.error("Error response from backend:", text);
        return null;
      }

      const data = await response.json();

      if (data.error) {
        console.error("Backend error:", data.error);
        return null;
      }

      // Use the 'price' key if available, otherwise check for an array of prices.
      if (data.price) {
        return parseFloat(data.price).toFixed(2);
      }
      if (data.prices && data.prices.length > 0) {
        return parseFloat(data.prices[0]).toFixed(2);
      }
      console.error("No price data found in response");
      return null;
    } catch (error) {
      console.error("Error fetching historical price:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchStocksFromAPI(query);
    }, 300);
  };

  const handleSelectStock = (stock) => {
    setSelectedStock(stock.ticker);
    setStockPrice("");
    setPurchaseDate("");
    setQuantity("");
    setIsOpen(false);
    setSearch("");
    setShowPurchaseForm(true); // Show the purchase form when a stock is selected
  };

  const handleSaveStock = async () => {
    // Log current input values for debugging
    console.log("Selected Stock:", selectedStock);
    console.log("Purchase Date:", purchaseDate);
    console.log("Stock Price:", stockPrice);
    console.log("Quantity:", quantity);

    // Require quantity and at least one of price or date
    if (!selectedStock || !quantity || (!stockPrice && !purchaseDate)) {
      alert("Please select a stock, enter quantity, and provide either price or purchase date.");
      return;
    }

    let finalPrice = stockPrice;
    let finalDate = purchaseDate;

    // If date provided but no price, fetch the historical price from your backend
    if (purchaseDate && !stockPrice) {
      finalPrice = await fetchHistoricalPrice(selectedStock, purchaseDate);
      if (!finalPrice) {
        alert("Error fetching historical price. Please try again.");
        return;
      }
    }

    // If only price provided but no date, use the current date
    if (stockPrice && !purchaseDate) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      finalDate = `${year}-${month}-${day}`;
    }

    const newStock = {
      ticker: selectedStock,
      price: finalPrice,
      date: finalDate,
      quantity: quantity,
      isActive: true,
    };

    if (selectedStocks.some((s) => s.ticker === newStock.ticker)) {
      alert(`${newStock.ticker} is already in your portfolio`);
      return;
    }

    if (user) {
      const updatedStocks = [...selectedStocks, newStock];
      setSelectedStocks(updatedStocks);

      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { stocks: updatedStocks }, { merge: true });

        if (onSelect) onSelect(newStock.ticker);
      } catch (error) {
        console.error("Error saving stocks:", error);
        alert("Error saving stock. Please try again.");
      }
    }

    // Reset fields after adding
    setSelectedStock("");
    setStockPrice("");
    setPurchaseDate("");
    setQuantity("");
    setSearch("");
    setShowPurchaseForm(false);
  };

  const handleCancelPurchase = () => {
    setSelectedStock("");
    setStockPrice("");
    setPurchaseDate("");
    setQuantity("");
    setShowPurchaseForm(false);
  };

  const handleToggleStock = (ticker) => {
    const updatedStocks = selectedStocks.map((stock) =>
      stock.ticker === ticker ? { ...stock, isActive: !stock.isActive } : stock
    );
    setSelectedStocks(updatedStocks);
  };

  const handleDeleteStock = async (ticker) => {
    const updatedStocks = selectedStocks.filter((stock) => stock.ticker !== ticker);
    setSelectedStocks(updatedStocks);

    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { stocks: updatedStocks }, { merge: true });
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <button
        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md text-left relative"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
          setFilteredStocks([]);
        }}
      >
        {selectedStock || "Select Stock"}
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col leading-none">
          <span className={`text-xs ${isOpen ? "text-white" : "text-gray-400"} -mt-1`}>
            ⌃
          </span>
          <span className={`text-xs ${isOpen ? "text-gray-400" : "text-white"} -mt-3`}>
            ⌄
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute w-full mt-2 bg-gray-700 text-white rounded-md shadow-lg z-50">
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2 pr-8 bg-gray-600 border-none text-white"
              placeholder="Search stocks..."
              value={search}
              onChange={handleSearchChange}
              autoFocus
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <ul className="max-h-60 overflow-y-auto">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock, index) => (
                <li
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-500"
                  onClick={() => handleSelectStock(stock)}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{stock.ticker}</span>
                    <span className="text-sm text-gray-300">{stock.fullName}</span>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400">No stocks found</li>
            )}
          </ul>
        </div>
      )}

      {/* Purchase Form */}
      {showPurchaseForm && selectedStock && (
        <div className="mt-4 p-4 bg-gray-700 rounded-md">
          <h3 className="text-lg font-medium text-white mb-2">Add {selectedStock} to Portfolio</h3>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-300 mb-1">
              Purchase Price ($) <span className="text-xs text-gray-400">(Optional if date provided)</span>
            </label>
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-300 mb-1">
              Purchase Date <span className="text-xs text-gray-400">(Optional if price provided)</span>
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => {
                const newDate = e.target.value;
                console.log("Date selected:", newDate);
                setPurchaseDate(newDate);
              }}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
            />
            {purchaseDate && !stockPrice && (
              <span className="text-xs text-blue-300 mt-1 block">
                Historical price will be fetched automatically
              </span>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">
              Quantity (Shares) <span className="text-xs text-gray-400">(Required)</span>
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
              placeholder="0"
              step="1"
              min="1"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={handleCancelPurchase}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveStock}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Fetching Data..." : "Add to Portfolio"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-medium text-white">Your Portfolio</h3>
        <ul className="mt-2">
          {selectedStocks.map((stock, index) => (
            <li key={index} className="px-4 py-2 flex justify-between items-center bg-gray-700 rounded-md mb-2">
              <div>
                <span className="font-medium">{stock.ticker}</span>
                {stock.quantity && <span className="ml-2 text-gray-300">({stock.quantity} shares)</span>}
              </div>
              <div className="flex items-center">
                <div className="text-right mr-2">
                  <div>${stock.price}</div>
                </div>
                <button 
                  onClick={() => handleDeleteStock(stock.ticker)} 
                  className="ml-3 text-red-400 hover:text-red-300"
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
          {selectedStocks.length === 0 && (
            <li className="px-4 py-2 text-gray-400">No stocks in portfolio</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StockComboBox;