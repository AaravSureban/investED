import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export const StockComboBox = ({ stocks, onSelect }) => {
  const [search, setSearch] = useState(""); // Search input state
  const [filteredStocks, setFilteredStocks] = useState(stocks); // Filtered stock list
  const [selectedStock, setSelectedStock] = useState(""); // Selected stock
  const [isOpen, setIsOpen] = useState(false); // Dropdown visibility
  const dropdownRef = useRef(null); // Reference for dropdown


  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    // Filter stocks based on query
    const filtered = stocks.filter((stock) =>
      stock.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  // Handle stock selection
  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    setIsOpen(false); // Close dropdown
    setSearch(""); // Clear search input
    onSelect(stock); // Pass selected stock to parent component
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
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedStock || "Select Stock"}

        {/* Caret Icons */}
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

          {/* Magnifying Glass Icon */}
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
    </div>
  );
};

export default StockComboBox;
