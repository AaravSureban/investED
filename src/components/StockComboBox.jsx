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
  const [isOpen, setIsOpen] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
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
            stock.description.toLowerCase().includes(queryLower)
        )
        .slice(0, 10);

      setFilteredStocks(
        filtered.map((stock) => ({
          ticker: stock.symbol,
          fullName: stock.description
        }))
      );
    } catch (error) {
      console.error("Error fetching stock data:", error);
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
    setIsOpen(false);
    setSearch("");
    setShowPurchaseForm(true); // Show the purchase form when a stock is selected
  };

  const handleSaveStock = async () => {
    if (!selectedStock || !stockPrice || !purchaseDate) {
      alert("Please select a stock and enter both a price and a date.");
      return;
    }

    const newStock = {
      ticker: selectedStock,
      price: stockPrice,
      date: purchaseDate,
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

        alert(`${newStock.ticker} added to your portfolio`);
      } catch (error) {
        console.error("Error saving stocks:", error);
        alert("Error saving stock. Please try again.");
      }
    }

    // Reset fields after adding
    setSelectedStock("");
    setStockPrice("");
    setPurchaseDate("");
    setSearch("");
    setShowPurchaseForm(false);
  };

  const handleCancelPurchase = () => {
    setSelectedStock("");
    setStockPrice("");
    setPurchaseDate("");
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
            <label className="block text-sm text-gray-300 mb-1">Purchase Price ($)</label>
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
          
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Purchase Date</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md"
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
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add to Portfolio
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-medium text-white">Your Portfolio</h3>
        <ul className="mt-2">
          {selectedStocks.map((stock, index) => (
            <li key={index} className="px-4 py-2 flex justify-between items-center bg-gray-700 rounded-md mb-2">
              <span className="font-medium">{stock.ticker}</span>
              <div className="flex items-center space-x-2">
                <span className="text-right">${stock.price}</span>
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