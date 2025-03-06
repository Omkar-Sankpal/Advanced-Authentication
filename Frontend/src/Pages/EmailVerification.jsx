import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../Store/authStore';
import toast from 'react-hot-toast';

const EmailVerification = () => {

    const [code, setCode] = useState(["", "", "", "", "", ""]); 
    const inputRefs = useRef([]); 
    const navigate = useNavigate();
    
    const {error, isLoading, verifyEmail} = useAuthStore(); 

    const handleChange = (index, value) => {
        const newCode = [...code] 

        if(value.length > 1) {
            const pastedCode = value.slice(0, 6).slice("");
            for(let i = 0 ; i < 6 ; i ++){
                newCode[i] = pastedCode[i] || "" ; 
            }
            setCode(newCode); 

            const lastfilledIndex = newCode.findLastIndex((digit) => digit !== ""); 
            const focusIndex = lastfilledIndex < 5 ? lastfilledIndex + 1 : 5; 
            inputRefs.current[focusIndex].focus ; 
        }
        else {
            newCode[index] = value; 
            setCode(newCode); 

            if(value && index < 5){
                inputRefs.current[index + 1].focus(); 
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if(e.key === "Backspace" && !code[index] && index > 0){
            inputRefs.current[index-1].focus(); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verifcationCode = code.join(""); 
        try {
            await verifyEmail(verifcationCode); 
            navigate("/"); 
            toast.success("Email verified successfully"); 
        } catch (error) {
            console.log(error); 
        }
    }

    //we need to auto submit if all 6 digits are entered 
    useEffect (() => {
        if(code.every(digit => digit !== '')){
            handleSubmit(new Event('submit'));
        }
    },[code])
    return (
        <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
            >
                <h2
                    className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Verify Your Email
                </h2>
                <p
                    className='text-center text-gray-300 mb-6'
                >
                    Enter the 6 Digit code sent to your email
                </p>
                <form
                    className='space-y-6' 
                    onSubmit={handleSubmit}
                >
                    <div
                        className='flex justify-between'
                    >
                        {code.map((digit, index) => (
                        <input
                            key = {index}
                            ref = {(eL) => (inputRefs.current[index] = eL)}
                            type='text'
                            maxLength='6'
                            value={digit}
                            onChange = {(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className= 'w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
                        />
                    ))}
                    </div>

                    {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap = {{scale : 0.95}}
                        type = 'submit'
                        disabled = {isLoading || code.some((digit) => !digit )}
                        className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
                    >
                        {isLoading ? "Verifying...." : "Verify Email"}
                    </motion.button>

                </form>
            </motion.div>
        </div>
    )
}

export default EmailVerification 


/*
NOTES : 
//note: react states are immutable hence we cannot change each state directly 2. useState will cause a re-render everytime it is called

// note: useRef provides a wau to persist mutalble values without causing re-renders i.e it stores a reference to a value or DOM node 

//note: if we dont use the spread operator '...' direct changes are made to original code
*/