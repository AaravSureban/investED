import React, { useState, useEffect } from "react";

export const Portfolio = () => {
    return (
        <section
          id="home"
          className="flex items-center justify-center h-screen text-white"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to investif<span className="text-green-500">.ai</span>
            </h1>
            <p className="text-lg md:text-xl">
              Your one-stop destination for smarter investments
            </p>
          </div>
        </section>
      );
};

export default Portfolio