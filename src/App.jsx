import { useState } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import "./index.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
        <div>
          <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
          <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
        </div>
    </>
  )
}

export default App
