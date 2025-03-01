import { useEffect } from "react";

export const Navbar = ({menuOpen, setMenuOpen}) => {
    useEffect(() => {
            document.body.style.overflow = menuOpen ? "hidden" : "";
        }, [menuOpen]);

    return (
        <nav className="fixed top-0 w-full left-0 z-40 bg-[rgba(40, 40, 40, 0.8)] backdrop-blur-lg shadow-md"> 
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <a href="#home" className="font-mono text-xl font-bold text-white"> 
                        {""}
                        investif<span className="text-green-500">.ai</span>{" "} 
                    </a>

                    <div 
                        className="w-7 h-5 relative cursor-pointer z-40 md:hidden" 
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        &#9776;
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a 
                            href="#home" 
                            className="text-gray-300 hove:text-white transition-colors"
                        > 
                            {" "}
                            Home{" "} 
                        </a>
                        <a 
                            href="#portfolio" 
                            className="text-gray-300 hove:text-white transition-colors"
                        > 
                            {" "}
                            Portfolio{" "} 
                        </a>
                        <a 
                            href="#signin" 
                            className="text-gray-300 hove:text-white transition-colors"
                        > 
                            {" "}
                            Sign In{" "} 
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}   