import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase";             // <-- import your db
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import { doc, onSnapshot } from "firebase/firestore"; // Import getDoc for single document
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import authentication

const PerplexityChat = () => {
  const [stockSymbols, setStockSymbols] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const responseContainerRef = useRef(null);

  // 2A. Load stock symbols from Firestore:
  useEffect(() => {
    const fetchSymbols = () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
          if (user) {
            const userId = user.uid; // Get logged-in user's UID
            console.log("Listening for stock updates for user:", userId);
      
            // Reference to the user's Firestore document
            const docRef = doc(db, "users", userId);
      
            // Real-time listener
            onSnapshot(docRef, (docSnap) => {
              if (docSnap.exists()) {
                const stockData = docSnap.data().stocks; // Access the stocks array
                
                if (Array.isArray(stockData)) {
                  const symbolsArray = stockData.map((stock) => stock.ticker); // Extract tickers
                  console.log("Updated stock tickers:", symbolsArray);
                  setStockSymbols(symbolsArray); // Update state in real-time
                } else {
                  console.log("No stock data found.");
                }
              } else {
                console.log("User's portfolio document not found.");
              }
            }, (error) => {
              console.error("Error with real-time listener:", error);
            });
          } else {
            console.log("No user is logged in.");
          }
        });
      };
  
    fetchSymbols();
  }, []); // Runs once on mount

  // 2B. Build your “pre-engineered” prompt using the data from Firestore
  const generatePrompt = () => {
    // If the user has zero or multiple symbols, handle accordingly
    if (!stockSymbols.length) {
      return "No stock symbols available. Please provide valid symbols.";
    }
    return (
      "Please search online for any current news about the following stocks: " +
      stockSymbols.join(", ") +
      ". Then summarize the latest headlines or information for each ticker symbol. Be concise in your answer. Lmit respnses to 100 words, while providing sentiment analysis on the articles you find to base your opinion."
    );
  };

  // 2C. Send request to your backend
  const handleGetNews = async () => {
    setLoading(true);
    setResponse("");

    try {
      const prompt = generatePrompt();
      const res = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: prompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response from backend:", data);

      if (data.choices && data.choices.length > 0) {
        setResponse(data.choices[0].message.content);
      } else {
        setResponse("No response received.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Failed to fetch response.");
    }

    setLoading(false);
  };

  // 2D. Autoscroll to bottom when response changes
  const scrollToBottom = () => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop =
        responseContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [response]);

  return (
    <div className="p-4 rounded shadow-md w-full">
      <h2 className="text-4xl font-semibold">Analyze Portfolio</h2>

      <p className="my-2">
        <strong>Tracking Stocks:</strong>{" "}
        {stockSymbols && stockSymbols.length
          ? stockSymbols.join(", ") : "Loading..."}
      </p>

      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={handleGetNews}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Latest News"}
      </button>

      <div
        className="mt-4 rounded h-48 overflow-y-auto"
        ref={responseContainerRef}
      >
        <h3 className="font-semibold"> Response:</h3>
        <pre className="whitespace-pre-wrap">{response}</pre>
      </div>
    </div>
  );
};

export default PerplexityChat;