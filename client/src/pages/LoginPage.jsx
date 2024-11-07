import React, { useState } from 'react'
import Input from '../components/Input'
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {Link} from "react-router-dom";

const inputs = [
    {
        type:"email",
        placeholder:"Enter Your Email Here...",
        name:"email"
    },
    {
        type:"password",
        placeholder:"Enter Your Password Here...",
        name:"password"
    },
]

const LoginPage = () => {
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
      });

    const {login} = useAuthStore();
    const navigate = useNavigate();
    
    const handleOnClick = async() => {
        const {email, password} = formValues
        try {
            await login(email, password);
            navigate("/")
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const renderInputs = () => {
        return inputs.map(({type, placeholder, name}, index)=>(
                <Input 
                type={type} 
                placeholder={placeholder} 
                name={name} 
                key={index}
                value={formValues[name]}
                onChange={handleChange}/>
            ))
    }
  return (
    <div className=''>
     <div className='min-h-96 w-96 border-2 border-black rounded-md p-10 flex flex-col justify-center'>
        {renderInputs()}
        <Link to="/forgot-password" className='py-4 underline text-blue-400'>Forgot Password</Link>
        <button className='border-2 bg-green-300 w-full p-4 hover:scale-105' onClick={handleOnClick}>
            Log in 
        </button>
     </div>
    </div>
  )
}

export default LoginPage
