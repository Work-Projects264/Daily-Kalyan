import ApiClient from "@/api/apiClient";
import Inputbox from "@/components/common/Inputbox";
import { handleChange } from "@/components/helpers/change";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getSetData } from "@/utils";

function VerifyOTP() {
  const router = useRouter();
  const [allData, setAllData] = useState({});
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdParam = urlParams.get('userId');
    if (userIdParam) {
      setUserId(userIdParam);
    } else {
      router.push('/signup');
    }
  }, []);

  const handleVerifyOTP = async () => {
    if (!allData.otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    try {
      const verifyOTPResponse = await ApiClient.VerifyOTP({
        user_id: userId,
        otp: allData.otp,
        app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8"
      });

      if (verifyOTPResponse.data.msg === 'Login successful.. Redirecting..') {
        toast.success("Registered successfully");
        getSetData("token", verifyOTPResponse.data.token);
        getSetData("userData", verifyOTPResponse?.data, true);
        router.push({
          pathname: '/',
          // query: { welcomesound: 'true' },
        });
      } else {
        toast.error(verifyOTPResponse.data.msg || 'OTP verification failed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || error?.message || 'An error occurred during OTP verification');
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="customCard p-4 w-100 mw-500 my-4" style={{ backgroundColor: '#2e3b4e', borderRadius: '10px', boxShadow: '0px 4px 8px rgba(0,0,0,0.1)' }}>
          <div onClick={router.back} className="back-btn" style={{ cursor: 'pointer' }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#f8c419">
              <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="mt-3" style={{ color: '#f8c419' }}>Verify OTP</h3>
            <p className="font-14 mb-3" style={{ color: '#dcdcdc' }}>Enter the OTP sent to your mobile</p>
          </div>
          <div className="mb-4">
            <Inputbox
              onChange={(val) => handleChange("otp", val, allData, setAllData, errors)}
              error={errors.otp}
              value={allData.otp}
              className="mb-3"
              label="OTP:"
              placeholder="Enter OTP"
              style={{ borderColor: '#f8c419' }}
            />
            <button 
              onClick={handleVerifyOTP} 
              className="btn btn-theme form-control mt-3"
              style={{
                backgroundColor: '#f8c419',
                color: '#2e3b4e',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e1b328'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f8c419'}
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
