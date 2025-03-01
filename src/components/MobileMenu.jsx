import { useEffect } from "react";

export const MobileMenu = ({menuOpen, setMenuOpen}) => {
    return (
        <div className={`fixed top-0 left-0 w-full bg-[rgva(40, 40, 40, 0.8)] z-40 flex fle-col items-center justify-center transition-all duration-300 ease-in-out ${menuOpen ? "h-screen opacity-100 pointer-events-auto" : "h-0 opacity-0 pointer-events-none"}`}>
            <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 text-white text-3xl focus:outline-none cursor-pointer" aria-label="Close Menu">
                &times;
            </button>

            <a href="#home" className="font-mono text-xl font-bold text-white"> 
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
                            onClick={() => setMenuOpen(false)}
                            className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                                        ${
                                            menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                                        }
                                `}
                        > 
                            {" "}
                            Home{" "} 
                        </a>
                        <a 
                            href="#portfolio" 
                            onClick={() => setMenuOpen(false)}
                            className={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                                ${
                                    menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                                }
                        `}
                        > 
                            {" "}
                            Portfolio{" "} 
                        </a>
                        <a 
                            href="#signin" 
                            onClick={() => setMenuOpen(false)}
                            cclassName={`text-2xl font-semibold text-white my-4 transform transition-transform duration-300
                                ${
                                    menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
                                }
                        `}
                        > 
                            {" "}
                            Sign In{" "} 
                        </a>
                    </div>
        </div>
    );
}   