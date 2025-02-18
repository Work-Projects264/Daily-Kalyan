import React, { useEffect, useState } from "react";
import ApiClient from "@/api/apiClient";
import Loader from "@/components/Loader";
import { addMoneyIcon, bankIcon, methodsIcon, withdrawIcon } from "@/resources/images";
import { getSetData } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FaWallet, FaHistory, FaMoneyBillAlt, FaCreditCard, FaExchangeAlt, FaCheckCircle } from 'react-icons/fa';
import ConditionalDownloadButton from "../ConditionalDownloadButton";

const Wallet = () => {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [holdAmount, setHoldAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fundData, setFundData] = useState([]);
  const [active, setActive] = useState(1);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const { user_id } = getSetData("userData", false, true);

  useEffect(() => {
    if (user_id) {
      fetchBalance();
      fetchInfo();
      fetchHistory();
    }
  }, [user_id]);

  const fetchBalance = () => {
    setLoading(true);
    ApiClient.wallet_amount({ user_id })
      .then((res) => {
        setAmount(res?.data?.wallet_amt || 0);
        setHoldAmount(res?.data?.hold_amt || 0);
      })
      .catch((error) => {
        console.error("Error fetching wallet amount:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchInfo = () => {
    setLoading(true);
    ApiClient.fundHistory({ user_id })
      .then((res) => {
        setFundData(res.data.fund_req_history);
      })
      .catch((error) => {
        console.log(error, "not working");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchHistory = () => {
    setLoading(true);
    ApiClient.WalletHistory({ user_id })
      .then((res) => {
        setTransactionHistory(res.data.transaction_history || []);
      })
      .catch((error) => {
        console.log(error, "not working");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderBankIcon = () => {
    return (
      <motion.div
        className="p-6 rounded-xl shadow-lg bg-gray-800 text-white space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaWallet className="text-yellow-400 mr-2 text-2xl" />
            <h3 className="text-xl font-semibold text-yellow-400">Wallet Overview</h3>
          </div>
        </div>

        <div className="text-center">
          <div className="text-gray-400">Available Balance</div>
          <div className="text-3xl font-bold text-green-500">{amount} Pts</div>
          <div className="text-gray-400">Hold Amount: {holdAmount} Pts</div>
        </div>

        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/add-fund" className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
            <div className="flex flex-col items-center">
              <FaMoneyBillAlt className="text-green-400 text-3xl mb-2" />
              <div className="text-sm">Add Point</div>
            </div>
          </Link>
          <Link href="/payment-methods" className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
            <div className="flex flex-col items-center">
              <FaCreditCard className="text-blue-400 text-3xl mb-2" />
              <div className="text-sm">Add Methods</div>
            </div>
          </Link>
          <Link href="/withdraw" className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors duration-300">
            <div className="flex flex-col items-center">
              <FaExchangeAlt className="text-red-400 text-3xl mb-2" />
              <div className="text-sm">Withdrawal</div>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    );
  };

  const renderTransactions = () => {
    return fundData.map((item, index) => {
      let amountSign = '+';
      let amountColor = '#28a745';
      let statusText = 'Approved';

      if (item.request_status === '0') {
        amountSign = '';
        amountColor = '#00659E';
        statusText = 'Pending';
      } else if (item.request_status === '1') {
        amountSign = '';
        amountColor = '#dc3545';
        statusText = 'Rejected';
      }

      return (
        <motion.div
          className="bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="text-sm font-semibold text-yellow-400 mb-1">Transaction ID: {item.request_number}</div>
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Status: <span className={`font-bold ${item.request_status === '0' ? 'text-blue-400' : item.request_status === '1' ? 'text-red-400' : 'text-green-400'}`}>{statusText}</span> - {item.insert_date}
            </div>
            <div className={`text-sm font-bold ${amountColor}`}>{amountSign} ₹{item.request_amount}</div>
          </div>
        </motion.div>
      );
    });
  };

  const renderHistory = () => {
    return transactionHistory.map((item, index) => (
      <motion.div
        className="bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
        key={item.transaction_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-yellow-400">Transaction ID: {item.tx_request_number}</div>
            <div className="text-xs text-gray-400">{item.transaction_note}</div>
            <div className="text-xs text-gray-400">{item.insert_date}</div>
            {item.transfer_note && <div className="text-xs text-gray-400">Note: {item.transfer_note}</div>}
          </div>
          <div className={`text-sm font-bold ${item.transaction_type === "1" ? 'text-green-400' : 'text-red-400'}`}>
            {item.transaction_type === "1" ? '+' : '-'} ₹{item.amount}
          </div>
        </div>
      </motion.div>
    ));
  };

  const renderTypes = () => {
    return (
      <motion.div
        className="flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className={`px-4 py-2 rounded-lg mb-4 font-semibold text-white hover:bg-gray-600 transition-colors duration-300 ${active === 1 ? 'bg-yellow-500' : 'bg-gray-700'}`}
          onClick={() => setActive(1)}
        >
          <FaHistory className="inline-block mr-2" /> Wallet History
        </button>
      </motion.div>
    );
  };

  const renderValues = {
    0: renderTransactions,
    1: renderHistory,
  };

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-3xl space-y-6">
        <ConditionalDownloadButton />
        {renderBankIcon()}
        <motion.div
          className="p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderTypes()}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-400">Loading transactions...</div>
            ) : (
              renderValues[active]()
            )}
          </div>
        </motion.div>
      </div>
      <Loader show={loading} />
    </motion.div>
  );
};

export default Wallet;
