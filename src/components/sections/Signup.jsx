import { useState } from "react";
import { motion } from "framer-motion";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const signUpWithGoogle = async () => {
        setAuthing(true);
        signInWithPopup(auth, new GoogleAuthProvider())
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setAuthing(false);
            });
    };

    const signUpWithEmail = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setAuthing(true);
        setError('');

        createUserWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    return (
        <motion.div 
            className="w-6/7 h-auto py-16 flex justify-center items-center bg-[#141414] mx-auto rounded-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.div
                className="w-3/4 max-w-md bg-[#1a1a1a] flex flex-col p-10 justify-center rounded-2xl shadow-lg"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="w-full flex flex-col text-white text-center">
                    <h3 className="text-4xl font-bold mb-2">Sign Up</h3>
                    <p className="text-lg mb-6">Welcome! Please enter your information below to begin.</p>
                </div>

                <div className="w-full flex flex-col mb-6">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Re-Enter Password"
                        className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <motion.button
                    className="w-full bg-transparent border border-white text-white font-semibold rounded-md p-3 mb-4 hover:bg-white hover:text-black transition-all"
                    onClick={signUpWithEmail}
                    disabled={authing}
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                >
                    Sign Up With Email and Password
                </motion.button>

                <div className="w-full flex items-center justify-center relative py-4">
                    <div className="w-full h-[1px] bg-gray-500"></div>
                    <p className="text-lg absolute text-gray-500 bg-[#1a1a1a] px-2">OR</p>
                </div>

                <motion.button
                    className="w-full bg-white text-black font-semibold rounded-md p-3 text-center hover:bg-gray-200 transition-all"
                    onClick={signUpWithGoogle}
                    disabled={authing}
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                >
                    Sign Up With Google
                </motion.button>

                <div className="w-full flex items-center justify-center mt-6">
                    <p className="text-sm font-normal text-gray-400">
                        Already have an account? 
                        <span className="font-semibold text-white cursor-pointer underline ml-1">
                            <a href="/login">Log In</a>
                        </span>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Signup;
