import React, { useState, useEffect } from "react";

export const Home = () => {
<header
  class="relative flex items-center justify-center h-screen mb-12 overflow-hidden"
>
  <div
    class="relative z-30 p-5 text-2xl text-white bg-purple-300 bg-opacity-50 rounded-xl"
  >
    Welcome to my site!
  </div>
  <video
    autoplay
    loop
    muted
    class="absolute z-10 w-auto min-w-full min-h-full max-w-none"
  >
    <source
      src="573261_Business_stock_3840x2160.mov"
      type="video/mov"
    />
    Your browser does not support the video tag.
  </video>
</header>
  const slides = [
    {
      title: <span className="text-green-500">"Portfolio Analysis"</span>,
      description:
        "Gain insights into your portfolio performance and identify areas for growth.",
    },
    {
      title: <span className="text-green-500">"Daily Quizzes"</span>,
      description: "Sharpen your financial knowledge with quick quizzes every day.",
    },
    {
      title: <span className="text-green-500">"Investing Concepts"</span>,
      description:
        "Explore crucial topics and stay ahead in your investment journey.",
    },
  ];
  // Track the current slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatically cycle slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="bg-opacity-0 text-white">
      {/* -- Hero Section: Full Screen -- */}
      <section className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to investif<span className="text-green-500">.ai</span>
        </h1>
        <p className="text-lg md:text-xl">
          Your one-stop destination for smarter investments
        </p>
      </section>
{/* -- Carousel Section: Smaller, with some padding -- */}
<section className="py-16 flex flex-col items-center">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold">
            Explore Our Features
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mt-2">
            Scroll through our highlights
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative w-full max-w-xl h-48 overflow-hidden">
          {/* Slides Wrapper */}
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center bg-opacity-0  p-4"
              >
                <h3 className="text-2xl font-semibold mb-2">{slide.title}</h3>
                <p className="text-center max-w-md">{slide.description}</p>
              </div>
            ))}
          </div>
{/* Slide Dots */}
<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full ${
                  idx === currentSlide ? "bg-green-500" : "bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};