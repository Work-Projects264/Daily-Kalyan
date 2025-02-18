import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ConditionalDownloadButton from '../ConditionalDownloadButton';
import { getSetData } from "@/utils";
import ApiClient from "@/api/apiClient";
import Inputbox from "@/components/common/Inputbox";
import { motion } from 'framer-motion';
import { FaCoins, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Fund = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState("");
  const { user_id } = getSetData("userData", false, true);
  const MIN_AMOUNT = 10;
  const MAX_AMOUNT = 500000;

  useEffect(() => {
    const checkUserToken = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!checkUserToken) {
      router.push('/login');
    }
  }, []);

  const validateAmount = (newAmount) => {
    if (newAmount < MIN_AMOUNT || newAmount > MAX_AMOUNT) {
      setError(`Amount must be between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
    validateAmount(newAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !validateAmount(Number(amount))) {
      setError(`Please enter a valid amount between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT}`);
      return;
    }

    const { user_name: name, mobile: phone } = getSetData("userData", undefined, true);

    try {
      const initResponse = await ApiClient.InitiateRazorPay({ user_id: Number(user_id), amount: Number(amount), mobile: false });

      if (initResponse.data.error) {
        setError(initResponse.data.error);
        return;
      }

      const { status, txn_id } = initResponse.data;
      if (status !== 'success') {
        throw new Error(initResponse.data.message || 'Failed to initiate transaction');
      }

      const formData = {
        am: Number(amount),
        name: name,
        m: phone,
        uid: Number(user_id),
        txid: txn_id
      };

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://www.prakartienterprises.in/payment/process_x.php';

      Object.entries(formData).forEach(([key, value]) => {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = value;
        form.appendChild(hiddenField);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error('Error initiating transaction:', error);
      setError('An error occurred while initiating the transaction. Please try again.');
    }
  };

  const handlePredefinedAmount = (amt) => {
    handleAmountChange(amt.toString());
  };

  const predefinedAmounts = [10, 300, 500, 1000, 2000, 5000, 10000, 20000];

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <ConditionalDownloadButton />
        <div className="text-center">
          <motion.h3
            className="text-3xl font-extrabold text-yellow-400 mb-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCoins className="inline-block mr-2 align-middle" /> Add Fund
          </motion.h3>
          <p className="text-sm text-gray-300">Top up your wallet to keep the game going!</p>
        </div>

        <div className="flex items-center justify-center text-lg font-bold text-orange-500">
          <span className="mr-2">Min: ₹{MIN_AMOUNT}</span>
          <span>Max: ₹{MAX_AMOUNT}</span>
        </div>
        <hr className="border-t-2 border-gray-700" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-md font-semibold text-yellow-400">Enter Amount</h3>
          <div className="relative">
            <Inputbox
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter Amount"
              inputclassName="pl-8 pr-3 py-2 w-full bg-gray-700 border border-gray-600 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-sm"
              
            />
            <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none mt-4">
              <span className="text-gray-400">₹</span>
            </div>
            {error && (
              <div className="absolute top-full left-0 mt-1 text-red-500 text-sm flex items-center ">
                <FaExclamationTriangle className="mr-1" />
                {error}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3 mt-5">
            {predefinedAmounts.map((amt) => (
              <motion.button
                key={amt}
                type="button"
                onClick={() => handlePredefinedAmount(amt)}
                className="w-full p-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ₹{amt}
              </motion.button>
            ))}
          </div>

          <motion.button
            type="submit"
            className="w-full mt-6 p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition-colors duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Proceed to Payment
          </motion.button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-400 flex items-center justify-center">
          <FaCheckCircle className="mr-1 text-green-500" />
          Please wait for 5 seconds after payment.
        </div>
      </div>
    </motion.div>
  );
};

export default Fund;
