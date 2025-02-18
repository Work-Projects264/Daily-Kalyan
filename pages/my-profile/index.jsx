import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import ApiClient from "@/api/apiClient";
import { getSetData } from "@/utils";

const Image = dynamic(() => import('next/image'), { ssr: false });

const MyProfile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const { user_id } = getSetData("userData", false, true);

  const getUserProfile = () => {
    setIsLoading(true);
    setError(null);
    let payload = {
      user_id: user_id,
    };

    ApiClient.userProfile(payload)
      .then((res) => {
        if (res?.data?.profile[0]) {
          setUserData(res.data.profile[0]);
        } else {
          setError("No profile data found");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch user profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getUserProfile();
    setIsClient(true);
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-lg w-full relative">
        <div onClick={router.back} className="absolute top-4 left-4 text-orange-500 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.5 4L6 12l8.5 8 1-1.5L9 12l4.5-6.5z"/>
          </svg>
        </div>
        <div className="text-center mb-6">
          <img src={"/profile.jpg"} style={{ maxWidth: "50%", objectFit: "contain" }} alt="Profile" className="rounded-full mx-auto" />
          <h3 className="text-3xl font-semibold text-orange-500">My Profile</h3>
          <p className="text-sm text-gray-400">Welcome, {userData?.user_name}</p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          {userData && (
            <ul className="space-y-3">
              <li className="text-lg"><strong>Name:</strong> {userData.user_name}</li>
              <li className="text-lg"><strong>Email:</strong> {userData.email}</li>
              <li className="text-lg"><strong>Mobile:</strong> {userData.mobile}</li>
              <li className="text-lg text-yellow-400"><strong>Wallet Balance:</strong> ₹{userData.wallet_balance}</li>
              <li className="text-lg"><strong>Member Since:</strong> {userData.insert_date}</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
