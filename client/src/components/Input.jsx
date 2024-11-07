import React from 'react'

const Input = ({type, placeholder, name, value, onChange}) => {
  return (
    <div>
      <input className="w-full border-2 border-black p-4 mb-8 focus:outline-none" type={type} placeholder={placeholder} name={name} value={value} onChange={onChange}/>
    </div>
  )
}

export default Input
