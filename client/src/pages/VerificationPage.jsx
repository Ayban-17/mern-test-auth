import { useState } from "react"
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const VerificationPage = () => {
    const [formValues, setFormValues] = useState({code:""})
    const {verifyEmail} = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleOnClick = async() =>{
      try {
        await verifyEmail(formValues.code);
        navigate("/");
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div>
      <div className='min-h-96 w-96 border-2 border-black rounded-md p-10'>
        <Input 
            type="text"
            placeholder="Enter Verification Code Here..."
            name="code"
            value={formValues['code']}
            onChange={handleChange}/>
        <button className='border-2 bg-green-300 w-full p-4 hover:scale-105' onClick={handleOnClick}>
            Verify
        </button>
      </div>
    </div>
  )
}

export default VerificationPage
