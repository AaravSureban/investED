import React, { useState, useRef, useEffect } from "react";
import { db } from "../firebase";             // <-- import your db
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import { doc, onSnapshot } from "firebase/firestore"; // Import getDoc for single document
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import authentication
import './perplexity.css';



const PerplexityChat = () => {
    const [stockSymbols, setStockSymbols] = useState([]);
    const [response, setResponse] = useState("");
    const [volatility, setVolatility] = useState("");
    const [predictions, setPredictions] = useState("");
    // const [loading, setLoading] = useState(false);
    const responseContainerRef = useRef(null);

    const [loadingResponse, setLoadingResponse] = useState(false);
    const [loadingVolatility, setLoadingVolatility] = useState(false);
    const [loadingPredictions, setLoadingPredictions] = useState(false);


    const [currentSlide, setCurrentSlide] = useState(0); // Default to 0 (Volatility)
    const slides = ["volatility", "response", "predictions"]; // Sections to show
    // const [prevMouseX, setPrevMouseX] = useState(0);

    // const handleMouseMove = (event) => {
    //     const mouseX = event.clientX;

    //     if (prevMouseX === 0) {
    //         setPrevMouseX(mouseX);
    //     } else {
    //         if (mouseX > prevMouseX) {
    //             // Mouse moved to the right, go to next slide
    //             setCurrentSlide((prevSlide) => (prevSlide + 1) / slides.length);
    //         } else if (mouseX < prevMouseX) {
    //             // Mouse moved to the left, go to previous slide
    //             setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) / slides.length);
    //         }
    //         setPrevMouseX(mouseX); // Update previous mouse X position
    //     }
    // };
    // useEffect(() => {
    //     window.addEventListener("mousemove", handleMouseMove);

    //     return () => {
    //         window.removeEventListener("mousemove", handleMouseMove);
    //     };
    // }, [prevMouseX]);

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length); // Loops back to the first slide
    };

    const goToPreviousSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length); // Loops back to the last slide
    };

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
    const generatePrompt = (type) => {
        // If the user has zero or multiple symbols, handle accordingly
        if (!stockSymbols.length) {
            return "No stock symbols available. Please provide valid symbols.";
        }
        if (type === "volatility") {
            return "Please analyze the volatility of the following stocks: " + stockSymbols.join(", ") + ". Provide a brief summary.";
        } else if (type === "predictions") {
            return "Please predict the future stock movements for the following stocks: " + stockSymbols.join(", ") + ". Provide a short analysis.";
        } else if (type === "response") {
            return (
                "Please search online for any current news about the following stocks: " +
                stockSymbols.join(", ") +
                ". Then summarize the latest headlines or information for each ticker symbol. Be concise in your answer. Lmit respnses to 100 words, while providing sentiment analysis on the articles you find to base your opinion."
            );
        }

    };


    // 2C. Send request to your backend
    const handleGetNews = async (type) => {

        if (type === "response") setLoadingResponse(true);
        else if (type === "volatility") setLoadingVolatility(true);
        else if (type === "predictions") setLoadingPredictions(true);


        try {
            const prompt = generatePrompt(type);
            const res = await fetch("http://127.0.0.1:5000/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: prompt }),
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            const data = await res.json();
            const result = data.choices?.[0]?.message?.content || "No response received.";

            if (type === "response") setResponse(result);
            else if (type === "volatility") setVolatility(result);
            else if (type === "predictions") setPredictions(result);
        } catch (error) {
            console.error("Error:", error);
            if (type === "response") setResponse("Failed to fetch response.");
            else if (type === "volatility") setVolatility("Failed to fetch response.");
            else if (type === "predictions") setPredictions("Failed to fetch response.");
        }

        // Reset loading state only for the button clicked
        if (type === "response") setLoadingResponse(false);
        else if (type === "volatility") setLoadingVolatility(false);
        else if (type === "predictions") setLoadingPredictions(false);
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

    return (<div className="p-4 rounded shadow-md w-full">
        <h2 className="text-4xl font-semibold">Analyze Portfolio</h2>

        <p className="my-2">
            <strong>Tracking Stocks:</strong>{" "}
            {stockSymbols && stockSymbols.length
                ? stockSymbols.join(", ")
                : "Loading..."}
        </p>

        <div className="flex justify-between mt-4">
            <button onClick={goToPreviousSlide} className="bg-blue-500 text-white p-2 rounded">
                Previous
            </button>
            <button onClick={goToNextSlide} className="bg-blue-500 text-white p-2 rounded">
                Next
            </button>
        </div>

        <div className="slider-container mt-4">
            <div
                className="slide"
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`, // Shift slides based on currentSlide
                }}
            >
                <div className="flex-shrink-0 w-full p-4">
                    <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={() => handleGetNews("volatility")}
                        disabled={loadingVolatility}
                    >
                        {loadingVolatility ? "Loading..." : "Get Volatility"}
                    </button>
                    <div className="mt-4 rounded h-48 overflow-y-auto">
                        <h3 className="font-semibold">Volatility:</h3>
                        <pre className="whitespace-pre-wrap">{volatility}</pre>
                    </div>
                </div>
            </div>

            <div
                className="slide"
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                }}
            >
                <div className="flex-shrink-0 w-full p-4">
                    <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={() => handleGetNews("response")}
                        disabled={loadingResponse}
                    >
                        {loadingResponse ? "Loading..." : "Get Latest News"}
                    </button>
                    <div className="mt-4 rounded h-48 overflow-y-auto">
                        <h3 className="font-semibold">Response:</h3>
                        <pre className="whitespace-pre-wrap">{response}</pre>
                    </div>
                </div>
            </div>

            <div
                className="slide"
                style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                }}
            >
                <div className="flex-shrink-0 w-full p-4">
                    <button
                        className="bg-blue-500 text-white p-2 rounded"
                        onClick={() => handleGetNews("predictions")}
                        disabled={loadingPredictions}
                    >
                        {loadingPredictions ? "Loading..." : "Get Predictions"}
                    </button>
                    <div className="mt-4 rounded h-48 overflow-y-auto">
                        <h3 className="font-semibold">Predictions:</h3>
                        <pre className="whitespace-pre-wrap">{predictions}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default PerplexityChat;