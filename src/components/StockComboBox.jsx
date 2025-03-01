import { useState, useRef, useEffect } from "react"; 
import { FaSearch } from "react-icons/fa";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const StockComboBox = ({ stocks, onSelect }) => {
  const [search, setSearch] = useState("");
  const [filteredStocks, setFilteredStocks] = useState(stocks);
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Handle authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch stocks from Firestore
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

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    const filtered = stocks.filter((stock) =>
      stock.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  // Handle stock selection and save to Firestore
  const handleSelectStock = async (stock) => {
    if (user && !selectedStocks.includes(stock)) {
      const updatedStocks = [...selectedStocks, stock];
      setSelectedStocks(updatedStocks);
      setSelectedStock(stock);
      onSelect(stock);

      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { stocks: updatedStocks }, { merge: true });
      } catch (error) {
        console.error("Error saving stocks:", error);
      }
    }

    setIsOpen(false);
    setSearch("");
  };

  // Handle stock removal
  const handleRemoveStock = async (stock) => {
    const updatedStocks = selectedStocks.filter((s) => s !== stock);
    setSelectedStocks(updatedStocks); // Update UI immediately

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { stocks: updatedStocks }, { merge: true });
    } catch (error) {
      console.error("Error removing stock:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* ComboBox Button */}
      <button
        className="w-full px-4 py-2 bg-gray-800 text-white rounded-md text-left relative"
        onClick={() => {
            setIsOpen(!isOpen)
            setSearch("");
            setFilteredStocks(stocks);
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

      {/* Dropdown with Fade-in Animation */}
      {isOpen && (
        <div
          className={`absolute w-full mt-2 bg-gray-700 text-white rounded-md shadow-lg z-50 
          transition-all duration-300 origin-top transform ${
            isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          }`}
        >
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2 pr-8 bg-gray-600 border-none text-white"
              placeholder="Search stocks..."
              value={search}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Stock List */}
          <ul className="max-h-40 overflow-y-auto">
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-500 cursor-pointer"
                  onClick={() => handleSelectStock(stock)}
                >
                  {stock}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400">No stocks found</li>
            )}
          </ul>
        </div>
      )}

      {/* Display Selected Stocks Below */}
      <div className="mt-4">
        <h3 className="text-md font-semibold text-white">Your Selected Stocks:</h3>
        <ul className="mt-2">
          {selectedStocks.map((stock, index) => (
            <li key={index} className="bg-gray-700 p-2 mt-1 rounded text-white flex justify-between items-center">
              {stock}
              <button
                onClick={() => handleRemoveStock(stock)}
                className="ml-3 text-[#F93943] hover:text-red-700 font-bold text-lg"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockComboBox;
