import React, { useState } from 'react'
import { useAuthStore } from '../Store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import {motion} from 'framer-motion';
import Input from '../components/Input';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';


const ResetPasswordPage = () => {
    
    const [password, setPassword] = useState("");
    const [newpassword, setNewPassoword] = useState(""); 

    const {resetPassword, error, isLoading, message} = useAuthStore(); 

    const {token} = useParams();
    const navigate = useNavigate(); 

    const handleSubmit = async(e) => {
        e.preventDefault(); 
        if(password != newpassword){
            alert("Password does not match");
            return ;
        }
        try {
            await resetPassword(token, password); 
            
            toast.success("Password reset was successful !")
            setTimeout(() => {
                navigate("/login"); 
            }, 2000);
            
        } catch (error) {
            console.log('called handel submit');
            console.log(error);
            toast.error(error.message || "Error setting new password");
        }
    }

    return (
    <motion.div
        initial = {{opacity: 0, y:20}}
        animate = {{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
        <div className='p-8'> 
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                Reset Password 
            </h2>
            {error && <p className='text-red-600 text-sm mb-4'>{error}</p>}
            {message && <p className='text-red-600 text-sm mb-4'>{message}</p>}

            <form onSubmit={handleSubmit}>
                <Input
                    icon = {Lock}
                    type = 'password'
                    placeholder = "New Password"
                    value = {password}
                    onChange= {(e) => (setPassword(e.target.value))}
                    required
                />
                <Input
                    icon = {Lock}
                    type = 'password'
                    placeholder = "Confirm New Password"
                    value = {newpassword}
                    onChange= {(e) => (setNewPassoword(e.target.value))}
                    required
                />
                <motion.button
                    whileHover={{scale: 1.05}}
                    whileTap ={{scale: 0.95}}
                    className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
                    type = 'submit'
                    disabled = {isLoading}
                >
                    {isLoading ? "Resetting..." : "Set New Password"}
                </motion.button>
            </form>

        </div>

    </motion.div>
  )
}

export default ResetPasswordPage