

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";


const questions = [
 {
   question: "What's the difference between saving and investing?",
   answers: [
     "Saving and investing are the same because both involve putting money aside for the future.",
     "Saving always earns a higher return than investing.",
     "Investing is only for wealthy individuals, while saving is for everyone.",
     "Saving involves setting aside money in a safe place, while investing involves using money to buy assets that may grow in value.",
   ],
   explanations: [
     "While both involve putting money aside, saving is risk-free while investing carries potential losses and gains.",
     "Investing typically has higher potential returns over time compared to savings accounts.",
     "Anyone can invest, even with small amounts, through diversified options like index funds and ETFs.",
     "Saving ensures security, while investing carries risk but has the potential for higher returns.",
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
   explanations: [
     "Investing at all-time highs can be risky, and it’s better to invest consistently over time.",
     "Having emergency savings ensures you don’t need to sell investments prematurely in case of unexpected expenses.",
     "Investing early allows you to benefit from compound growth over the long term.",
     "Relying on tips instead of research can lead to uninformed and risky investment decisions.",
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
   explanations: [
     "Investing everything leaves you vulnerable to emergencies and market downturns.",
     "While any amount is helpful, increasing your investment as your income grows can lead to greater long-term gains.",
     "Investing should be done with surplus funds after ensuring financial security and covering necessary expenses.",
     "Although investing carries risk, avoiding it entirely may prevent long-term wealth growth.",
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
   explanations: [
     "Loans to companies are bonds, not stocks, and offer fixed interest instead of ownership.",
     "Stocks give investors partial ownership in a company and a potential share of profits.",
     "Savings accounts are bank deposits that earn low interest, unlike stocks which fluctuate in value.",
     "Bonds are debt instruments issued by governments or corporations, while stocks represent ownership.",
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
   explanations: [
     "No one can predict market movements with certainty due to economic and external factors.",
     "Even experts struggle to time the market, making long-term investing usually more effective.",
     "Social media trends can be unreliable and may lead to impulsive investment decisions.",
     "Stock market movements vary based on multiple factors and do not follow a fixed annual pattern.",
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
   explanations: [
     "Many investments incur fees such as transaction costs, fund expense ratios, or advisory fees.",
     "Even self-directed investing can involve brokerage fees and fund expenses.",
     "Investments may involve costs such as brokerage fees, fund management fees, and taxes on profits.",
     "Many platforms allow you to start investing with as little as a few dollars.",
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
   explanations: [
     "Holding only one stock increases risk as your entire portfolio depends on one company’s performance.",
     "Diversification helps minimize risk by spreading investments across various assets.",
     "Concentrating all your money in one stock can lead to high risk if that company underperforms.",
     "Avoiding investments entirely may prevent long-term wealth growth and limit financial opportunities.",
   ],
   correct: 1,
 },
];


function Quiz() {
 // Randomly select a question on initial render.
 const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
   Math.floor(Math.random() * questions.length)
 );
 const [selectedAnswer, setSelectedAnswer] = useState(null);
 const [submitted, setSubmitted] = useState(false);
 const [isCorrect, setIsCorrect] = useState(null);


 const question = questions[currentQuestionIndex];


 const handleSelect = (answerIndex) => {
   if (!submitted) {
     setSelectedAnswer(answerIndex === selectedAnswer ? null : answerIndex);
   }
 };


 const handleSubmit = () => {
   if (selectedAnswer === null) return; // do nothing if no answer is selected
   setSubmitted(true);
   setIsCorrect(selectedAnswer === question.correct);
 };


 const handleRandomQuestion = () => {
   // Pick a new random question
   const randomIndex = Math.floor(Math.random() * questions.length);
   setCurrentQuestionIndex(randomIndex);
   // Reset selection and submission state
   setSelectedAnswer(null);
   setSubmitted(false);
   setIsCorrect(null);
 };


 return (
   <div className="max-w-2xl mx-auto p-4 bg-gray-800 text-white">
     <h1 className="text-2xl font-bold mb-4">Investment Quiz</h1>
     <Card className="mb-4 border-black border-2 bg-gray-700">
       <CardContent className="p-4">
         <p className="font-semibold mb-2 text-white">{question.question}</p>
         {question.answers.map((answer, aIndex) => {
           // Determine the button's background based on submission and selection.
           let btnStyle = "bg-gray-600 text-white";
           if (submitted) {
             if (aIndex === question.correct) {
               btnStyle = "bg-green-500 text-white";
             } else if (aIndex === selectedAnswer) {
               btnStyle = "bg-red-500 text-white";
             }
           } else if (selectedAnswer === aIndex) {
             btnStyle = "bg-blue-500 text-white";
           }
           return (
             <Button
               key={aIndex}
               onClick={() => handleSelect(aIndex)}
               className={`block w-full text-left p-2 my-1 border rounded-lg transition-colors ${btnStyle}`}
             >
               {answer}
             </Button>
           );
         })}
       </CardContent>
     </Card>
     <div className="flex space-x-4">
       <Button
         onClick={handleSubmit}
         disabled={submitted || selectedAnswer === null}
         className="bg-green-500 text-white p-2 flex-1"
       >
         Submit
       </Button>
       <Button
         onClick={handleRandomQuestion}
         className="bg-yellow-500 text-white p-2 flex-1"
       >
         Random Question
       </Button>
     </div>
     {submitted && (
       <div className="mt-4">
         <p className="text-xl font-semibold">
           {isCorrect ? "Correct!" : "Incorrect!"}
         </p>
         <p className="mt-2 text-lg">
           {question.explanations[selectedAnswer]}
         </p>
       </div>
     )}
   </div>
 );
}


// Home component with hero, carousel, and the Quiz section remains mostly unchanged.
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


 // Auto-slide every 7 seconds
 useEffect(() => {
   const interval = setInterval(() => {
     setCurrentSlide((prev) => (prev + 1) % slides.length);
   }, 7000);
   return () => clearInterval(interval);
 }, [slides.length]);


 return (
   <div className="w-full text-white">
     {/* Quiz Section */}
     <section className="py-8">
       <Quiz />
     </section>
   </div>
 );
};


export default Home;

