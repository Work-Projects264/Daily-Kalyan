import ApiClient from "@/api/apiClient";
import Inputbox from "@/components/common/Inputbox";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFileDownload } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const gamePage = () => {
  const [gameDetails, setGameDetails] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [allData, setAllData] = useState({});
  const [errors, setErrors] = useState({});
  const pathname = usePathname();
  const slug = pathname?.split("/").pop();
  const router = useRouter();

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
        app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8",
      });

      if (checkMobileResponse.data.status === true) {
        const signUpResponse = await ApiClient.userSignUp(payload);

        if (signUpResponse.data.status === true) {
          const sendotp = await ApiClient.sendotp({
            mobile: signUpResponse.data.mobile,
            app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8",
          });
          if (sendotp.data.status === true) {
            toast.success(sendotp.data.msg);
            router.push(`/verify-otp?userId=${sendotp.data.user_id}`);
          } else {
            toast.error(sendotp.data.msg);
          }
        } else {
          toast.error(signUpResponse.data.msg || "Sign-up failed");
        }
      } else {
        toast.error(
          checkMobileResponse.data.msg || "Mobile number not registered"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.msg ||
          error?.message ||
          "An error occurred during sign-up"
      );
    }
  };

  const fetChGameDetails = () => {
    ApiClient.getGamePageDetails({
      app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8",
      title: slug,
    })
      .then((res) => {
        setGameDetails(res.data.result[0]);
      })
      .catch((err) => {
        console.error("Error fetching game details:", err);
      });
  };

  const DownloadApplication = () => {
    router.push("https://backend.jodiplay.com/logo/Jodi_Play.apk");
  };

  const handleChange = (field, value, allData, setAllData, errors) => {
    setAllData({ ...allData, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  const scrollToTop = () => {
    router.push("/");
  };

  useEffect(() => {
    fetChGameDetails();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto py-8 px-4">
        <motion.div
          className="prose lg:prose-xl text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {gameDetails ? (
            <div dangerouslySetInnerHTML={{ __html: gameDetails?.description }} />
          ) : (
            <p className="text-center text-gray-400">Data not found</p>
          )}
        </motion.div>

        <motion.div
          className="md:w-2/5 mx-auto mt-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-yellow-400 text-center mb-4">Sign Up</h3>
            <p className="text-sm text-gray-300 text-center mb-4">Create Your Account</p>

            <Inputbox
              onChange={(val) =>
                handleChange("name", val, allData, setAllData, errors)
              }
              value={allData.name || ""}
              error={errors.name}
              className="mb-3"
              label="Your Name:"
              placeholder="Enter Full Name"
              inputclassName="text-black"
            />
            <Inputbox
              onChange={(val) =>
                handleChange("mobile", val, allData, setAllData, errors)
              }
              value={allData.mobile || ""}
              error={errors.mobile}
              className="mb-3"
              type="number"
              label="Mobile Number:"
              placeholder="Enter 10 Digit Phone Number"
              inputclassName="text-black"
            />
            <Inputbox
              onChange={(val) =>
                handleChange("password", val, allData, setAllData, errors)
              }
              error={errors.password}
              value={allData.password || ""}
              className="mb-3"
              label="Password:"
              placeholder="Enter password"
              type="password"
              inputclassName="text-black"
            />

            <motion.button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="fixed bottom-4 left-4 right-4 bg-gray-800 p-3 rounded-lg shadow-xl text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={DownloadApplication}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFileDownload className="mr-2" /> Download Mobile App
          </motion.button>
        </motion.div>

        {isVisible && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-20 left-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowUp />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default gamePage;
