import { useEffect } from "react";
import { Link } from "react-router-dom";

export const Navbar = ({ menuOpen, setMenuOpen }) => {
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
    }, [menuOpen]);

    return (
        <nav className="fixed top-0 w-full left-0 z-40 bg-[rgba(40, 40, 40, 0.8)] backdrop-blur-lg shadow-md"> 
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="font-mono text-xl font-bold text-[rgb(247, 235, 232)]"> 
                        investif<span className="text-green-500">.ai</span> 
                    </Link>

                    {/* Mobile Menu Button */}
                    <div 
                        className="w-7 h-5 relative cursor-pointer z-40 md:hidden" 
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        &#9776;
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/" 
                            className="text-gray-300 hover:text-[rgb(247, 235, 232)] transition-colors"
                        > 
                            Home
                        </Link>
                        <Link 
                            to="/portfolio" 
                            className="text-gray-300 hover:text-[rgb(247, 235, 232)] transition-colors"
                        > 
                            Portfolio
                        </Link>
                        <Link 
                            to="/signin" 
                            className="text-gray-300 hover:text-[rgb(247, 235, 232)] transition-colors"
                        > 
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
