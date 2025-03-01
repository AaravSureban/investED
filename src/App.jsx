import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { MobileMenu } from './components/MobileMenu';
import { Signin } from './components/sections/Signin';
import { Home } from './components/sections/Home';
import { Portfolio } from './components/sections/Portfolio';
import "./index.css";

function App() {
  const [isLoaded, setIsLoaded ] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  return (
    <Router>
        <div className={`min-h-screen transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"} bg-gray text-gray-300`}>
          <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
          <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>
        </div>
    </Router>
  )
}

export default App
