import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const PriceDelta = ({ stockId }) => {
  // Guard clause: Check if stockId is provided
  if (!stockId) {
    return <div>Error: No stock selected. Please provide a valid stock ID.</div>;
  }

  const [currentPrice, setCurrentPrice] = useState(null);
  const [purchasePrice, setPurchasePrice] = useState(null);
  const [error, setError] = useState(null);

  // Initialize Firestore
  const db = getFirestore();

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Reference to the specific stock document in the "stocks" collection
        const stockDocRef = doc(db, 'stocks', stockId);
        const stockDocSnap = await getDoc(stockDocRef);

        if (stockDocSnap.exists()) {
          const data = stockDocSnap.data();
          setPurchasePrice(data.purchasePrice);
          setCurrentPrice(data.currentPrice);
        } else {
          setError('No stock data found.');
        }
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
      }
    };

    fetchStockData();
  }, [stockId, db]);

  // Calculate the net change in price if both prices are available
  const netChange =
    currentPrice !== null && purchasePrice !== null
      ? (currentPrice - purchasePrice).toFixed(2)
      : null;

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="price-delta">
      <h3>Price Delta</h3>
      {currentPrice !== null && purchasePrice !== null ? (
        <div>
          <p>Purchase Price: ${purchasePrice}</p>
          <p>Current Price: ${currentPrice}</p>
          <p>Net Change: ${netChange}</p>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default PriceDelta;