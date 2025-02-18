import ApiClient from "@/api/apiClient";
import { getSetData } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConditionalDownloadButton from "../ConditionalDownloadButton";
const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  const router = useRouter();

  useEffect(() => {
    const checkUserToken = getSetData("token");

    if (!checkUserToken) {
      router.push("/login");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const { user_id } = getSetData("userData", false, true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_new_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    ApiClient.passwordChange({ old_password: formData.old_password, new_pass: formData.new_password, user_id })
      .then((res) => {
        setInfo(res?.data);
        if (!res.data.status) {
          toast.error(res.data.msg);
        } else {
          toast.success(res.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        toast.error("Failed to Change");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg w-full">
      <h2 className="text-3xl font-bold text-orange-500 text-center mb-4">Change Password</h2>
      <p className="text-center text-gray-400 mb-6">Update Your Profile Password</p>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-4">
          <label htmlFor="old_password" className="block text-yellow-300 mb-1">Old Password:</label>
          <input
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-gray-900 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Existing Password"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="new_password" className="block text-yellow-300 mb-1">New Password:</label>
          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-gray-900 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter New Password"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirm_new_password" className="block text-yellow-300 mb-1">Confirm Password:</label>
          <input
            type="password"
            name="confirm_new_password"
            value={formData.confirm_new_password}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-gray-900 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Confirm Password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-md transition transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  </div>
  );
};

export default ChangePassword;
