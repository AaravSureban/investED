import React, { useState, useEffect } from "react";

export const Home = () => {
  const slides = [
    {
      title: "Portfolio Analysis",
      description:
        "Gain insights into your portfolio performance and identify areas for growth.",
      image: "/portfolio-analysis.jpg",
    },
    {
      title: "Daily Quizzes",
      description:
        "Sharpen your financial knowledge with quick quizzes every day.",
      image: "/daily-quizzes.jpg",
    },
    {
      title: "Investing Concepts",
      description:
        "Explore crucial topics and stay ahead in your investment journey.",
      image: "/investing-concepts.jpg",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="20250301_1027_Dynamic Stock Trends_simple_compose_01jn98hshff3vrhe67dnxg4se2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Hero Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to investif<span className="text-green-500">.ai</span>
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Your one-stop destination for smarter investments
          </p>
          <button 
        className="btn-primary"
      >
        Go to Portfolio
      </button>
        </div>
      </section>
      <div className="text-center mb-8">
          <h2 className="text-10xl md:text-4xl font-semibold">
            Explore Our Features
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mt-2">
            Scroll through our highlights
          </p>
        </div>
      {/* Carousel Section */}
      <section className="relative flex flex-col items-center justify-center py-8">
        {/* Outer container that hides overflow */}
        
        <div className="overflow-hidden w-full max-w-5xl mx-auto">
          {/* Inner track that slides horizontally */}
          <div
            className="flex transition-transform duration-[4000ms] ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="min-w-full flex-shrink-0 flex justify-center px-4"
              >
                {/* Card */}
                <div className="bg-green-500 text-white font-semibold rounded-lg shadow-md p-8 max-w-2xl w-full flex flex-col items-center justify-center">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-80 object-cover rounded-md mb-4"
                  />
                  {/* Removed the h2, only keep description text */}
                  <p className="text-xl md:text-2xl text-center">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Navigation Buttons */}
        <div className="flex space-x-4 mt-6">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors 
                ${
                  currentSlide === index
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                }`}
            >
              {slide.title}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
