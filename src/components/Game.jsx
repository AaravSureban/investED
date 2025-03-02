import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./Game.css"; // Import CSS for effects

// Register chart components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const economicEvents = [
  { 
    name: "Tech Boom", 
    change: 0.15, 
    goodChoice: "buy", 
    reason: "Tech companies report record earnings, sending stocks soaring!",
    description: "A wave of innovation and strong earnings reports cause tech stocks to surge. Investors are optimistic about future growth."
  },
  { 
    name: "Market Crash", 
    change: -0.25, 
    goodChoice: "sell", 
    reason: "A massive selloff wipes out billions in value.",
    description: "Panic spreads as major companies report lower earnings. The stock market plunges, with investors rushing to liquidate their positions."
  },
  { 
    name: "Federal Rate Hike", 
    change: -0.08, 
    goodChoice: "sell", 
    reason: "Higher interest rates slow economic growth, hurting stocks.",
    description: "The Federal Reserve raises interest rates to combat inflation. This makes borrowing more expensive, reducing corporate profits."
  },
  { 
    name: "Corporate Tax Cut", 
    change: 0.10, 
    goodChoice: "buy", 
    reason: "Lower taxes mean bigger profits for companies and higher stock values!",
    description: "The government announces a major tax break for businesses, boosting their earnings and making stocks more attractive to investors."
  },
  { 
    name: "Energy Crisis", 
    change: -0.12, 
    goodChoice: "hold", 
    reason: "Holding was the best choice to avoid unnecessary risk.",
    description: "Oil prices skyrocket due to geopolitical instability, increasing costs for businesses and pushing inflation higher."
  },
  { 
    name: "Consumer Spending Surge", 
    change: 0.08, 
    goodChoice: "buy", 
    reason: "A strong economy lifts profits, making stocks a great investment.",
    description: "Retailers and consumer goods companies report higher-than-expected sales, signaling strong consumer confidence."
  }
];

const Game = () => {
  const [balance, setBalance] = useState(10000);
  const [balanceHistory, setBalanceHistory] = useState([10000]);
  const [rounds, setRounds] = useState([0]);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [flashRed, setFlashRed] = useState(false);
  const [flashGreen, setFlashGreen] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      generateEvent();
    }
  }, [balance]);

  const generateEvent = () => {
    if (gameOver) return;
    const event = economicEvents[Math.floor(Math.random() * economicEvents.length)];
    setCurrentEvent(event);

    // If the event has a negative impact, trigger shake effect
    if (event.change < 0) {
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500); // Stop shaking after 500ms
    }
  };

  const handleDecision = (decision) => {
    if (!currentEvent || gameOver) return;

    let newBalance = balance;
    let feedback = "";

    if (decision === "buy") {
      newBalance *= (1 + currentEvent.change); // Investing money in the event
    } else if (decision === "sell") {
      newBalance *= (1 - currentEvent.change); // Selling before an event impact
    }

    if (decision === currentEvent.goodChoice) {
      feedback = `✅ Good choice! ${currentEvent.reason}`;
      
      // Flash green effect for good choices
      setFlashGreen(true);
      setTimeout(() => setFlashGreen(false), 300); // Remove flash effect after 300ms
    } else {
      feedback = `❌ Bad choice! The best move was to ${currentEvent.goodChoice}. ${currentEvent.reason}`;
      
      // Flash red effect for bad choices
      setFlashRed(true);
      setTimeout(() => setFlashRed(false), 300); // Remove flash effect after 300ms
    }

    setBalance(newBalance);
    setBalanceHistory((prev) => [...prev, newBalance]);
    setRounds((prev) => [...prev, currentRound]);
    setCurrentRound((prev) => prev + 1);
    setMessage(feedback);

    if (newBalance <= 0) {
      setGameOver(true);
      setMessage("Game Over! You lost all your money.");
    } else {
      setTimeout(generateEvent, 1500);
    }
  };

  return (
    <div className={`game-container ${flashRed ? "flash-red" : ""} ${flashGreen ? "flash-green" : ""} ${shakeScreen ? "shake-screen" : ""}`}>
      <h2>Stock Market Mini-Game</h2>
      <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>

      <div style={{ height: "300px", width: "100%", marginBottom: "20px" }}>
        <Line 
          data={{ labels: rounds, datasets: [{ label: "Balance Over Time", data: balanceHistory, borderColor: "#007bff", backgroundColor: "rgba(0,123,255,0.2)", borderWidth: 2, fill: true }] }} 
          options={{ responsive: true, maintainAspectRatio: false }} 
        />
      </div>

      {gameOver ? (
        <h3 className="game-over">Game Over! You lost all your money.</h3>
      ) : (
        <>
          {currentEvent && (
            <div>
              <h3>Event: {currentEvent.name}</h3>
              <p><em>{currentEvent.description}</em></p>
              <p>How will you respond?</p>
              <button onClick={() => handleDecision("buy")} className="decision-btn">Buy</button>
              <button onClick={() => handleDecision("sell")} className="decision-btn">Sell</button>
              <button onClick={() => handleDecision("hold")} className="decision-btn">Hold</button>
            </div>
          )}
        </>
      )}

      <h3>{message}</h3>
    </div>
  );
};

export default Game;