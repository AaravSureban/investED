import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Banknote,
  PieChart,
  Layers,
  Bolt,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Game from "../Game";

// React Flow imports
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

export default function Learn() {
  const navigate = useNavigate();
  // ---------------------------
  // 1) Data for "Investing vs. Saving" chart
  // ---------------------------
  const investmentData = [
    { year: "Year 0", savings: 1000, investing: 1000 },
    { year: "Year 5", savings: 1100, investing: 1750 },
    { year: "Year 10", savings: 1210, investing: 3200 },
    { year: "Year 15", savings: 1330, investing: 5500 },
    { year: "Year 20", savings: 1460, investing: 9000 },
  ];

  // ---------------------------
  // 2) Example list of asset classes
  // ---------------------------
  const assetClasses = [
    {
      name: "Stocks",
      icon: <TrendingUp size={32} />,
      description: "Equity in companies that can appreciate over time.",
    },
    {
      name: "Bonds",
      icon: <Banknote size={32} />,
      description: "Fixed-income securities offering stable returns.",
    },
    {
      name: "ETFs",
      icon: <PieChart size={32} />,
      description: "Diversified funds holding multiple assets.",
    },
    {
      name: "Real Estate",
      icon: <Layers size={32} />,
      description: "Property investments for income and long-term growth.",
    },
    {
      name: "Crypto",
      icon: <Bolt size={32} />,
      description: "Highly volatile digital assets like Bitcoin.",
    },
  ];

  // ---------------------------
  // 3) Simple slider for demonstrating risk tolerance
  // ---------------------------
  const [riskTolerance, setRiskTolerance] = useState(50);

  // ---------------------------
  // 4) Core Flow State: We'll store nodes, edges, and expansions
  // ---------------------------
  const [nodes, setNodes] = useState([
    // Root node
    {
      id: "root",
      type: "input",
      data: { label: "Pick Your Interest" },
      position: { x: 300, y: 0 },
      style: { fontWeight: "bold", color: "black" },
    },
    // Sector nodes
    { id: "tech", data: { label: "Tech" }, position: { x: 0, y: 150 } },
    { id: "health", data: { label: "Health" }, position: { x: 200, y: 150 } },
    { id: "sports", data: { label: "Sports" }, position: { x: 400, y: 150 } },
    { id: "music", data: { label: "Music" }, position: { x: 600, y: 150 } },
    { id: "esports", data: { label: "eSports" }, position: { x: 800, y: 150 } },
  ]);

  const [edges, setEdges] = useState([
    // Root -> Sectors
    { id: "e-root-tech", source: "root", target: "tech", animated: true },
    { id: "e-root-health", source: "root", target: "health", animated: true },
    { id: "e-root-sports", source: "root", target: "sports", animated: true },
    { id: "e-root-music", source: "root", target: "music", animated: true },
    { id: "e-root-esports", source: "root", target: "esports", animated: true },
  ]);

  // Keep track of which sectors have been "expanded" by the user
  const [expandedSectors, setExpandedSectors] = useState({
    tech: false,
    health: false,
    sports: false,
    music: false,
    esports: false,
  });

  // ---------------------------
  // Sub-nodes and edges for each sector
  // (We only add them after user clicks the sector)
  // ---------------------------
  // Tech
  const techNodes = [
    { id: "apple", data: { label: "Apple (AAPL)" }, position: { x: -50, y: 300 } },
    { id: "google", data: { label: "Alphabet (GOOGL)" }, position: { x: 50, y: 380 } },
    { id: "microsoft", data: { label: "Microsoft (MSFT)" }, position: { x: -80, y: 460 } },
  ];
  const techEdges = [
    { id: "e-tech-apple", source: "tech", target: "apple" },
    { id: "e-tech-google", source: "tech", target: "google" },
    { id: "e-tech-msft", source: "tech", target: "microsoft" },
  ];

  // Health
  const healthNodes = [
    { id: "jnj", data: { label: "J&J (JNJ)" }, position: { x: 160, y: 300 } },
    { id: "pfizer", data: { label: "Pfizer (PFE)" }, position: { x: 100, y: 380 } },
    { id: "unh", data: { label: "UnitedHealth (UNH)" }, position: { x: 220, y: 460 } },
  ];
  const healthEdges = [
    { id: "e-health-jnj", source: "health", target: "jnj" },
    { id: "e-health-pfizer", source: "health", target: "pfizer" },
    { id: "e-health-unh", source: "health", target: "unh" },
  ];

  // Sports
  const sportsNodes = [
    { id: "nike", data: { label: "Nike (NKE)" }, position: { x: 360, y: 300 } },
    { id: "adidas", data: { label: "Adidas (ADDYY)" }, position: { x: 420, y: 380 } },
    { id: "dicks", data: { label: "Dick’s (DKS)" }, position: { x: 320, y: 460 } },
  ];
  const sportsEdges = [
    { id: "e-sports-nike", source: "sports", target: "nike" },
    { id: "e-sports-adidas", source: "sports", target: "adidas" },
    { id: "e-sports-dicks", source: "sports", target: "dicks" },
  ];

  // Music
  const musicNodes = [
    { id: "spotify", data: { label: "Spotify (SPOT)" }, position: { x: 580, y: 300 } },
    { id: "sirius", data: { label: "Sirius XM (SIRI)" }, position: { x: 650, y: 380 } },
  ];
  const musicEdges = [
    { id: "e-music-spotify", source: "music", target: "spotify" },
    { id: "e-music-sirius", source: "music", target: "sirius" },
  ];

  // eSports
  const esportsNodes = [
    { id: "activision", data: { label: "Activision (ATVI)" }, position: { x: 770, y: 300 } },
    { id: "ea", data: { label: "Electronic Arts (EA)" }, position: { x: 870, y: 380 } },
  ];
  const esportsEdges = [
    { id: "e-esports-activision", source: "esports", target: "activision" },
    { id: "e-esports-ea", source: "esports", target: "ea" },
  ];

  // ---------------------------
  // Handle user clicks on sector nodes
  // ---------------------------
  const handleNodeClick = (event, node) => {
    // If user clicked on a sector node, expand if not already done
    const { id } = node;

    // If it's not a sector or is already expanded, do nothing
    if (!expandedSectors.hasOwnProperty(id) || expandedSectors[id] === true) {
      return;
    }

    // Expand that sector
    let newNodes = [];
    let newEdges = [];

    if (id === "tech") {
      newNodes = techNodes;
      newEdges = techEdges;
    } else if (id === "health") {
      newNodes = healthNodes;
      newEdges = healthEdges;
    } else if (id === "sports") {
      newNodes = sportsNodes;
      newEdges = sportsEdges;
    } else if (id === "music") {
      newNodes = musicNodes;
      newEdges = musicEdges;
    } else if (id === "esports") {
      newNodes = esportsNodes;
      newEdges = esportsEdges;
    }

    // Add the new nodes/edges to state
    setNodes((prev) => [...prev, ...newNodes]);
    setEdges((prev) => [...prev, ...newEdges]);

    // Update expanded state
    setExpandedSectors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  return (
    

    
    <div className="max-w-5xl mx-auto p-6 space-y-12">



      {/* 1) Why Investing Matters (vs. Saving) */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl text-[#282828] font-bold text-center mb-4">Why Investing Matters (vs. Saving)</h2>
        <p className="text-gray-600 text-center mb-6">
          Saving is important for short-term security, but investing allows your
          money to grow significantly over time.
        </p>

        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={investmentData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#8884d8"
                strokeWidth={3}
                name="Savings"
              />
              <Line
                type="monotone"
                dataKey="investing"
                stroke="#34d399"
                strokeWidth={3}
                name="Investing"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <p className="text-gray-500 mt-4 text-center">
          Over the long run, investing tends to outpace simple saving due to
          compounding returns.
        </p>
      </motion.div>

      {/* 2) Different Asset Classes */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl text-[#282828] font-bold text-center mb-4">
          Know Your Asset Classes
        </h2>
        <p className="text-gray-600 text-center mb-6">
          A balanced portfolio often spans multiple asset classes to manage risk
          and rewards effectively.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {assetClasses.map((asset, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-lg p-4 flex flex-col items-center"
              whileHover={{ scale: 1.03 }}
            >
              <div className="mb-2 text-indigo-600">{asset.icon}</div>
              <h3 className="text-lg font-semibold mb-1">{asset.name}</h3>
              <p className="text-gray-600 text-center">{asset.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 3) Risk & Reward, Diversification, Time Horizons */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl text-[#282828] font-bold text-center mb-4">
          Risk &amp; Reward, Diversification, and Time Horizons
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Understand that investing involves balancing risk, diversifying your
          portfolio, and planning for the long run.
        </p>

        <div className="flex flex-col items-center space-y-4">
          {/* Risk Tolerance Slider */}
          <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Tolerance
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              className="w-full cursor-pointer"
            />
            <div className="text-center mt-2 text-sm text-gray-600">
              {riskTolerance < 30
                ? "Conservative (Low Risk)"
                : riskTolerance < 70
                ? "Balanced (Moderate Risk)"
                : "Aggressive (High Risk)"}
            </div>
          </div>

          {/* Time Horizons Explanation */}
          <div className="max-w-2xl text-gray-700 text-center">
            <p className="mb-2">
              <strong>Short-Term (under 5 years):</strong> Focus on
              lower-volatility assets and liquidity.
            </p>
            <p className="mb-2">
              <strong>Medium-Term (5–10 years):</strong> Balance growth
              (stocks, ETFs) with more stable assets (bonds).
            </p>
            <p>
              <strong>Long-Term (10+ years):</strong> Time to ride out
              market cycles and harness compounding returns.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 4) Branching Visualization (GitHub-style), with dynamic expansions */}
      <motion.div
        className="bg-white rounded-xl shadow-md p-6"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl text-[#282828] font-bold text-center mb-4">
          Explore Investing by Sectors
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Click on a sector node (Tech, Health, Sports, Music, eSports) to
          reveal some popular traded companies within that sector.
        </p>

        <div className="w-full h-[600px]">

          
  <ReactFlow
    nodes={nodes}
    edges={edges}
    fitView
    onNodeClick={handleNodeClick}
    style={{ background: "#282828" }} // Keep the background dark
  >
    {/* MiniMap Styling Fix */}
    <MiniMap nodeColor={() => "#A895DA"} style={{ backgroundColor: "#F7EBE8" }} />

    {/* Controls Visibility */}
    <Controls style={{ color: "#F7EBE8" }} />

    {/* Background Grid (Improved Visibility) */}
    <Background gap={16} color="#93C48B" />
  </ReactFlow>

  <div className="mt-13 flex flex-row items-center justify-center space-x-4 pb-10">
  <button
    onClick={() => navigate("/game")}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
  >
    Test Your Skills!
  </button>
  <button
    onClick={() => navigate("/quiz")}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
  >
    Quiz Yourself!
  </button>
</div>



</div>
      </motion.div>
    </div>

    
    
  );
  
}