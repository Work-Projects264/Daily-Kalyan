import ApiClient from "@/api/apiClient";
import Inputbox from "@/components/common/Inputbox";
import { handleChange } from "@/components/helpers/change";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

function Signup() {
  const router = useRouter();
  const [allData, setAllData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkUserToken = typeof window !== 'undefined' && localStorage.getItem('token');
    if (checkUserToken) {
      router.push('/');
    }
  }, []);

  const handleSubmit = async () => {
    let errors = {};

    if (!allData.name) errors.name = "Name is required";
    if (!allData.mobile) errors.mobile = "Mobile number is required";
    if (!allData.password) errors.password = "Password is required";

    if (Object.keys(errors).length) {
      setErrors(errors);
      return;
    }

    const payload = {
      app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8",
      name: allData.name,
      email: "user@gmail.com",
      mobile: allData.mobile,
      password: allData.password,
      security_pin: "12234",
      betting_status: 1,
    };

    try {
      const checkMobileResponse = await ApiClient.CheckMobile({
        mobile: allData.mobile,
        app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8"
      });

      if (checkMobileResponse.data.status === true) {
        const signUpResponse = await ApiClient.userSignUp(payload);

        if (signUpResponse.data.status === true) {
          const sendotp = await ApiClient.sendotp({mobile: signUpResponse.data.mobile, app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8"});
          if (sendotp.data.status === true) {
            toast.success(sendotp.data.msg);
            router.push(`/verify-otp?userId=${sendotp.data.user_id}`);
          } else {
            toast.error(sendotp.data.msg);
          }
        } else {
          toast.error(signUpResponse.data.msg || 'Sign-up failed');
        }
      } else {
        toast.error(checkMobileResponse.data.msg || 'Mobile number not registered');
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || error?.message || 'An error occurred during sign-up');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-lg w-full relative">
        <div className="absolute top-4 left-4 text-orange-500 cursor-pointer" onClick={router.back}>
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.5 4L6 12l8.5 8 1-1.5L9 12l4.5-6.5z"/>
          </svg>
        </div>
        <div className="text-center mb-6">
          <h3 className="text-3xl font-semibold text-orange-500">Sign Up</h3>
          <p className="text-sm text-gray-400">Create Your Account</p>
        </div>
        <div className="mb-6">
          <Inputbox
            onChange={(val) => handleChange("name", val, allData, setAllData, errors)}
            value={allData.name}
            error={errors.name}
            className="mb-4"
            label="Your Name"
            placeholder="Enter Full Name"
            labelClassName="text-orange-300"
          />
          <Inputbox
            onChange={(val) => handleChange("mobile", val, allData, setAllData, errors)}
            value={allData.mobile}
            error={errors.mobile}
            className="mb-4"
            type="number"
            label="Mobile Number"
            placeholder="Enter 10 Digit Phone Number"
            labelClassName="text-orange-300"
          />
          <Inputbox
            onChange={(val) => handleChange("password", val, allData, setAllData, errors)}
            error={errors.password}
            value={allData.password}
            className="mb-4"
            label="Password"
            placeholder="Enter Password"
            type="password"
            labelClassName="text-orange-300"
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
          >
            Sign Up
          </button>
        </div>
        <div className="my-3 text-center">
          <p className="text-sm text-gray-400">Already have an account?</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 mt-3 bg-transparent border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white focus:outline-none transition"
          >
            Login Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
