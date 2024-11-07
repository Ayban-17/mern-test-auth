import React, { useState } from 'react'
import Input from '../components/Input'
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [formValues, setFormValues] = useState({email:""});

    const {forgotPassword} = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
        console.log(formValues);
    }

    const handleOnClick = async () =>{
        const {email} = formValues;
        try {
            await forgotPassword(email);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
      <Input 
      type="email" 
      placeholder="Enter You Email..."
      name="email" 
      value={formValues["email"]}
      onChange={handleChange}/>

        <button className='bg-green-400 text-white px-10 py-4 w-full hover:scale-105' onClick={handleOnClick}>
            Reset Password 
        </button>
    </div>
  )
}

export default ForgotPasswordPage
