import React, { useState, useEffect } from "react";
import { Button } from "/Users/anshugusain/Documents/GitHub/investif.ai/src/components/ui/button.jsx";
import { Card, CardContent } from "/Users/anshugusain/Documents/GitHub/investif.ai/src/components/ui/card.jsx";


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
       <p className="mt-4 text-xl font-semibold">
         {isCorrect ? "Correct!" : "Incorrect!"}
       </p>
     )}
   </div>
 );
}


// Home component with hero, carousel, and the Quiz section remains mostly unchanged.
export const Home = () => {


    <div>
     {/* Quiz Section */}
     <section className="py-8">
       <Quiz />
     </section>
   </div>
};


export default Home;






