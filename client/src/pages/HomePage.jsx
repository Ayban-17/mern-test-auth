import React from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const {user} = useAuthStore();

  const handleOnClick = async() => {
    await logout();
    navigate("/login")
  }
 
  return (
    <div>
      HOME PAGE
      <div>Name: {user.name}<br/> email: {user.email} </div>
      <button className='bg-red-950 text-white px-10 py-4' onClick={handleOnClick}>
        logout
      </button>
    </div>
  )
}

export default HomePage
