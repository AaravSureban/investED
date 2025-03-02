import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signin from './components/sections/Signin'
import Signup from './components/sections/Signup'
import { initializeApp } from "firebase/app";
import { app } from "./firebase";

createRoot(document.getElementById('root')).render(

    <App />

)
