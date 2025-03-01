import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase";             // <-- import your db
import { collection, getDocs } from "firebase/firestore"; // Firestore functions

const PerplexityChat = () => {
  const [stockSymbols, setStockSymbols] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const responseContainerRef = useRef(null);

  // 2A. Load stock symbols from Firestore:
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        console.log("Fetching stock symbols from Firestore...");
        const querySnapshot = await getDocs(collection(db, "stocks"));
        const symbolsArray = [];
  
        querySnapshot.forEach((doc) => {
          console.log("Found document:", doc.data()); // Debugging
          symbolsArray.push(doc.data().symbol);
        });
  
        if (symbolsArray.length === 0) {
          console.log("No stocks found in Firestore.");
        }
  
        setStockSymbols(symbolsArray);
      } catch (error) {
        console.error("Error fetching symbols:", error);
      }
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
      ". Then summarize the latest headlines or information for each ticker symbol."
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
    <div className="p-4 border rounded shadow-md w-full">
      <h2 className="text-lg font-semibold">Analyze Portfolio</h2>

      <p className="my-2">
        <strong>Tracking Stocks:</strong>{" "}
        {stockSymbols && stockSymbols.length
          ? stockSymbols.join(", ") : "Loading from DB or none found"}
      </p>

      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={handleGetNews}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Latest News"}
      </button>

      <div
        className="mt-4 p-2 border rounded h-48 overflow-y-auto bg-gray-100"
        ref={responseContainerRef}
      >
        <h3 className="font-semibold">## Response:</h3>
        <pre className="whitespace-pre-wrap">{response}</pre>
      </div>
    </div>
  );
};

export default PerplexityChat;