import ApiClient from "@/api/apiClient";
import Loader from "@/components/Loader";
import Inputbox from "@/components/common/Inputbox";
import { handleChange } from "@/components/helpers/change";
import { getSetData } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useDispatch } from 'react-redux';
import { setUserId } from '@/redux/slice';

function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const forgotclick = () => {
    router.push('/forgot');
  };

  const handleSubmit = () => {
    let errors = {};

    if (!allData.mobile) {
      errors.mobile = "Mobile number is required";
    }
    if (!allData.password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }

    let payload = {
      mobile: allData.mobile,
      password: allData.password,
    };

    setLoading(true);

    ApiClient.userLogin(payload)
      .then((response) => {
        setLoading(false);
        getSetData("token", response.data.token);
        getSetData("userData", response?.data, true);
        dispatch(setUserId(response.data.user_id)); 
        toast.success("Login Successfully");

        // window.location = "";
        router.push('/?welcomesound=true');
      })
      .catch((error) => {
        toast.error("Invalid Details");
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
    <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-lg w-full relative">
      <div onClick={router.back} className="absolute top-4 left-4 text-orange-500 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.5 4L6 12l8.5 8 1-1.5L9 12l4.5-6.5z"/>
        </svg>
      </div>
      <div className="text-center mb-6">
        {/* <img src={"/logo.png"} style={{ maxWidth: "50%", objectFit: "contain" }} alt="logo" /> */}
        <h3 className="text-3xl font-semibold text-orange-500">Login</h3>
        <p className="text-sm text-gray-400">Welcome Back</p>
      </div>
      <div className="mb-6">
        <Inputbox
          onChange={(val) => handleChange("mobile", val, allData, setAllData, errors)}
          value={allData.mobile}
          error={errors.mobile}
          className="mb-4"
          type="number"
          label="Mobile Number"
          placeholder="Enter 10 Digit Phone Number"
        />
        <div className="position-relative mb-4">
          <Inputbox
            onChange={(val) => handleChange("password", val, allData, setAllData, errors)}
            value={allData.password}
            error={errors.password}
            label="Password"
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
          />
          <div
            className="position-absolute top-50 end-0 me-2 mt-2 translate-middle-y cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
        >
          Login
        </button>
      </div>
      <div className="my-3 text-center">
        <p className="text-sm text-gray-400 cursor-pointer" onClick={forgotclick}>
          Forgot Password?
        </p>
        <p className="text-sm text-gray-400">Don't have an account?</p>
        <button
          onClick={() => router.push("/signup")}
          className="w-full py-3 mt-3 bg-transparent border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white focus:outline-none transition"
        >
          Create New Account
        </button>
      </div>
    </div>
  </div>
  );
}

export default Login;
