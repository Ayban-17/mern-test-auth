import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Input from '../components/Input'
import { useAuthStore } from '../store/authStore';

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
    {
        type:"text",
        placeholder:"Enter Your Username Here...",
        name:"username"
    },
]

const SignUpPage = () => {
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        username: ''
      });

    const navigate = useNavigate(); 

    const {signup} = useAuthStore();

    const handleOnClick = async () => {
        const {email, password, username}= formValues;
        try {
            const response = await signup(email, password, username);
            alert(response.message);
            navigate("/verify");
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
     <div className='min-h-96 w-96 border-2 border-black rounded-md p-10'>
        {renderInputs()}
        <button className='border-2 bg-green-300 w-full p-4 hover:scale-105' onClick={handleOnClick}>
            Sign Up
        </button>
     </div>
    </div>
  )
}

export default SignUpPage
