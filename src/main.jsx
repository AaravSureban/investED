import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signin from './components/sections/Signin'
import Signup from './components/sections/Signup'
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAjxvGmQhmL_I2UpGZQC1Y8_KrueDLI8ME" ,
  authDomain: "investifai-21641.firebaseapp.com",
  projectId: "investifai-21641",
  storageBucket: "investifai-21641.firebasestorage.app",
  messagingSenderId: "1009283837142",
  appId: "1:1009283837142:web:83053e1c0b16f233eaad77"
};

const app = initializeApp(firebaseConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
