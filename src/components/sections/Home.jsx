import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import VantaBackground from '../VantaBackground';
import { Link } from "react-router-dom";
import Headlines from '../Headlines';


// Quiz questions array and component definition
const questions = [
 {
   question: "What's the difference between saving and investing?",
   answers: [
   "Saving and investing are the same because both involve putting money aside for the future.",
   "Saving always earns a higher return than investing.",
   "Investing is only for wealthy individuals, while saving is for everyone.",
   "Saving involves setting aside money in a safe place, while investing involves using money to buy assets that may grow in value.",
   ],
   correct: 3,
 },
 {
   question: "When should I invest?",
   answers: [
   "Only when the stock market is at an all-time high.",
   "As soon as you have an emergency fund and extra money to invest.",
   "Only after retirement.",
   "Only when you get a stock tip from a friend.",
   ],
   correct: 1,
 },
 {
   question: "How much should I invest?",
   answers: [
   "Every penny you have, to maximize returns.",
   "Only a fixed amount of $500 per year.",
   "As much as you can afford after covering expenses and building an emergency fund.",
   "You should never invest; it's too risky.",
   ],
   correct: 2,
 },
 {
   question: "What is a stock?",
   answers: [
   "A loan you give to a company in exchange for guaranteed interest payments.",
   "A share of ownership in a company that represents a claim on its earnings and assets.",
   "A savings account that pays high interest.",
   "A government bond that matures over time.",
   ],
   correct: 1,
 },
 {
   question: "Can you time the stock market?",
   answers: [
   "Yes, professional investors can predict market movements with 100% accuracy.",
   "No, consistently predicting market highs and lows is nearly impossible.",
   "Yes, just follow social media trends and buy or sell accordingly.",
   "Yes, stocks always go up at the same time every year.",
   ],
   correct: 1,
 },
 {
   question: "How much does investing cost?",
   answers: [
   "Investing is always free, and there are no costs involved.",
   "Investing has no costs unless you hire a financial advisor.",
   "Investing can have costs such as trading fees, fund expenses, and taxes.",
   "You must have at least $50,000 to start investing.",
   ],
   correct: 2,
 },
 {
   question: "What is diversification?",
   answers: [
   "Buying only one stock and holding it forever.",
   "Spreading investments across different assets to reduce risk.",
   "Putting all your money into one company’s stock to maximize profits.",
   "Avoiding investments altogether to stay safe.",
   ],
   correct: 1,
 },
];


function Quiz() {
 const [selectedAnswers, setSelectedAnswers] = useState(
   Array(questions.length).fill(null)
 );
 const [score, setScore] = useState(null);


 const handleSelect = (questionIndex, answerIndex) => {
   const newAnswers = [...selectedAnswers];
   newAnswers[questionIndex] =
   newAnswers[questionIndex] === answerIndex ? null : answerIndex;
   setSelectedAnswers(newAnswers);
 };


 const handleSubmit = () => {
   const correctAnswers = questions.reduce(
   (acc, question, index) =>
       acc + (selectedAnswers[index] === question.correct ? 1 : 0),
   0
   );
   setScore(correctAnswers);
 };


 return (
   <div className="max-w-2xl mx-auto p-4 bg-gray-800 text-white">
   <h1 className="text-2xl font-bold mb-4">Investment Quiz</h1>
   {questions.map((q, qIndex) => (
       <Card key={qIndex} className="mb-4 border-black border-2 bg-gray-700">
       <CardContent className="p-4">
           <p className="font-semibold mb-2 text-white">{q.question}</p>
           {q.answers.map((answer, aIndex) => (
           <Button
               key={aIndex}
               onClick={() => handleSelect(qIndex, aIndex)}
               className={`block w-full text-left p-2 my-1 border rounded-lg transition-colors ${
               selectedAnswers[qIndex] === aIndex
                   ? "bg-blue-500 text-white"
                   : "bg-gray-600 text-white"
               }`}
           >
               {answer}
           </Button>
           ))}
       </CardContent>
       </Card>
   ))}
   <Button
       onClick={handleSubmit}
       className="mt-4 bg-green-500 text-white p-2 w-full"
   >
       Submit
   </Button>
   {score !== null && (
       <p className="mt-4 text-xl font-semibold">
       You got {score} out of {questions.length} correct!
       </p>
   )}
   </div>
 );
}


// Home component with hero, carousel, and the Quiz section
export const Home = () => {
 const slides = [
   {
   title: "Portfolio Analysis",
   description:
       "Gain insights into your portfolio performance and identify areas for growth.",
   image: "../portfolio.jpg",
   },
   {
   title: "Daily Quizzes",
   description:
       "Sharpen your financial knowledge with quick quizzes every day.",
   image: "../quiz.jpg",
   },
   {
   title: "Investing Concepts",
   description:
       "Explore crucial topics and stay ahead in your investment journey.",
   image: "../concepts.jpg",
   },
 ];


 const [currentSlide, setCurrentSlide] = useState(0);


 // Auto-slide every 7 seconds
 useEffect(() => {
   const interval = setInterval(() => {
   setCurrentSlide((prev) => (prev + 1) % slides.length);
   }, 7000);
   return () => clearInterval(interval);
 }, [slides.length]);


 return (
   <div className="w-full text-white">
   <div className="bg" id="vanta"> </div>
   {/* Hero Section */}
   <section className="relative h-screen flex flex-col items-center justify-center text-center">
       <div className="relative z-10">
       <h1 className="text-9xl md:text-24xl font-light mb-30">
   Smarter Investing{" "}
   <span className="relative group">
   Starts{" "}
   <Link
     to="/learn"
     className="relative text-green-500 transition-colors duration-600 group-hover:text-green-400"
   >
     Here
     <span className="absolute left-1/2 bottom-0 w-0 h-[6px] bg-green-500 transition-all duration-600 group-hover:w-full group-hover:left-0"></span>
   </Link>
   </span>
   </h1>
       <h2 className="text-10xl md:text-4xl font-semibold mb-6">Explore Our Features</h2>
       <p className="text-lg md:text-xl text-gray-300 mt-2">
       Scroll through our highlights
       </p>
       </div>
       <div className="fixed top-0 left-0 w-screen h-screen">
       <VantaBackground />
       </div>
   </section>


   {/* Carousel Section */}
  
   <section className="relative flex flex-col items-center justify-center py-8">
       <div className="overflow-hidden w-full max-w-5xl mx-auto">
       <div
           className="flex transition-transform duration-[4000ms] ease-in-out"
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
       >
           {slides.map((slide, index) => (
           <div
               key={index}
               className="min-w-full flex-shrink-0 flex justify-center px-4"
           >
               <div className="bg-black text-white font-semibold rounded-lg shadow-md p-8 max-w-2xl w-full flex flex-col items-center justify-center">
               <img
                   src={slide.image}
                   alt={slide.title}
                   className="w-full h-80 object-cover rounded-md mb-4"
               />
               <p className="text-xl md:text-2xl text-center">
                   {slide.description}
               </p>
               </div>
           </div>
           ))}
       </div>
       </div>
       <div className="text-center mb-30">
       <section className="py-16 flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6">Top Market Movers</h2>
                <Headlines />
            </section>
       </div>
       <div className="flex space-x-4 mt-6">
       {slides.map((slide, index) => (
           <button
           key={index}
           onClick={() => setCurrentSlide(index)}
           className={`px-4 py-2 rounded-full font-semibold transition-colors ${
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


export default Home;









