import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);


  // Function to handle user logout
  const logout = async () => {
    try {
        axios.defaults.withCredentials = true; // cookies
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/');
    } catch (error) {
        toast.error(error.message);
    }
  }

  //send verification email
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true; // cookies
      const {data} = await axios.post(backendUrl + "/api/auth/send-verify-otp")
      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message + " Please try again later.");
      
    }
  }

  return (
    <div className="w-full flex justify-between items-centre p-4 sm:p-6 sm:px-24 absolute top-0">
      <img onClick={() => navigate("/")} src={assets.logo} alt="" className="w-28 sm:w-32" />
      {userData ? 
      <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group hover:bg-purple-950 cursor-pointer'>
          {userData.name[0].toUpperCase()}
          <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10 ">
            <ul className='list-none bg-gray-100 p-2 m-0 shadow-lg text-sm'>
              {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer">Verify email</li>}
              
              <li onClick={logout} className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10">Logout</li>
            </ul>

          </div>
      </div>
      : <button
        onClick={() => navigate("/login")}
        className="flex items-centre gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
      >
        {" "}
        Login <img src={assets.arrow_icon} alt="" />
      </button>}
      
    </div>
  );
};

export default Navbar;
