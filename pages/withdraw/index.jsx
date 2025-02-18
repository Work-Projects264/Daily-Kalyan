import ApiClient from "@/api/apiClient";
import Loader from "@/components/Loader";
import Inputbox from "@/components/common/Inputbox";
import { getSetData } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProfileUpdateConfirmation from "@/pages/ProfileUpdateConfirmation";
import ConditionalDownloadButton from "../ConditionalDownloadButton";
import Swal from "sweetalert2";

const Withdraw = () => {
  const router = useRouter();
  const checkUserToken = !!getSetData("token");

  const [active, setActive] = useState(0);
  const [paymentData, setpaymentData] = useState({});
  const [walletDetails, setWalletDetails] = useState({});
  const [loading, setloading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setamount] = useState("");
  const [withdrawHistory, setwithdrawHistory] = useState([]);
  const [getwithdrawTime, setwithdrawTime] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const { user_id } = getSetData("userData", false, true);

  const handleShowModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const methodCodes = {
    1: "Bank Account",
    2: "Paytm Number",
    3: "Google Pay Number",
    4: "PhonePe Number",
    5: "UPI ID",
  };

  let paymentKeys = {
    "Bank Account": "ac_number",
    "Paytm Number": "paytm_number",
    "Google Pay Number": "google_pay_number",
    "PhonePe Number": "phone_pay_number",
    "UPI ID": "upi_id",
  };

  useEffect(() => {
    if (user_id) {
      fetchBalance();
      fetchWithdrawTransactionHistory();
      getPaymentDetails();
    }
  }, [user_id]);

  useEffect(() => {
    if (!checkUserToken) {
      router.push("/signup");
    }
  }, []);

  const reset = () => {
    setPaymentMethod("");
    setamount("");
  };

  const userWithdrawFundRequest = () => {
    if (!amount || isNaN(amount)) {
      return alert("Please enter a valid amount");
    }

    if (!paymentMethod) {
      return alert("Please select a valid payment method");
    }

    if (+walletDetails?.min_withdrawal > +amount) {
      Swal.fire({
        title: "Oops!",
        text: `Minimum withdrawal: ${walletDetails?.min_withdrawal}₹`,
        icon: "error",
      });
      return;
    }

    let payload = {
      user_id,
      request_amount: amount,
      payment_method: paymentMethod,
    };

    setloading(true);
    ApiClient.userWithdrawFundRequest(payload)
      .then((res) => {
        setloading(false);
        fetchBalance();
        reset();
        toast.success(res?.data?.msg || "");
      })
      .catch((err) => {
        setloading(false);
        toast.error("Something went wrong");
        console.log(err);
      });
  };

  const getPaymentDetails = () => {
    setloading(true);
    ApiClient.userPaymentDetails({ user_id })
      .then((res) => {
        const paymentDetails = res?.data?.payment_details;

        if (paymentDetails && paymentDetails.length > 0) {
          setpaymentData(paymentDetails[0]);
          handleCloseModal();
        } else {
          handleShowModal();
        }
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
      });
  };

  const fetchWithdrawTransactionHistory = () => {
    setloading(true);
    ApiClient.withdrawTransactionHistory({ user_id })
      .then((res) => {
        setloading(false);
        setwithdrawHistory(res.data.withdrawdata || []);
        setwithdrawTime(res.data || []);
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
      });
  };

  const fetchBalance = () => {
    setloading(true);
    ApiClient.wallet_amount({ user_id })
      .then((res) => {
        setloading(false);
        setWalletDetails(res?.data || {});
      })
      .catch((error) => {
        setloading(false);
        console.error("Error fetching wallet amount:", error);
      });
  };

  const renderTypes = () => {
    const activeClass = (item) => {
      if (active === item) {
        return "bg-orange-400";
      }
      return "";
    };

    return (
      <div className="flex justify-around gap-4 my-5 ">
        <button
          className={` ${activeClass(0)}  w-full py-3 text-white `}
          onClick={() => setActive(0)}
        >
          Withdrawal
        </button>
        <button
          className={` ${activeClass(1)} w-full py-3 text-white`}
          onClick={() => setActive(1)}
        >
          History
        </button>
      </div>
    );
  };

  const withdraw = () => {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="border p-4 text-center mb-4 bg-gray-900 rounded-lg">
          <div className="text-orange-500 text-xl font-bold">Available Amount</div>
          <div className="text-white text-lg">{walletDetails?.wallet_amt}</div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="text-white">
            <strong>Withdrawal Timing:</strong> {getwithdrawTime?.withdraw_open_time} -{" "}
            {getwithdrawTime?.withdraw_close_time}
          </div>
          <div className="text-white">
            <strong>Min Withdrawal:</strong> {walletDetails?.min_withdrawal}
          </div>
        </div>

        <div className="my-4">
          <Inputbox
            className="w-full"
            placeholder="Enter Withdrawal Amount"
            onChange={setamount}
            value={amount}
          />
        </div>

        <div className="mb-4">
          <strong className="text-white">Choose Withdrawal Method:</strong>
          {paymentData?.google_pay_number && (
            <div className="flex gap-2 text-white">
              <input
                type="radio"
                name="paymentMethod"
                value="3"
                checked={paymentMethod === "3"}
                onChange={() => setPaymentMethod("3")}
              />
              Google Pay
            </div>
          )}
          {paymentData?.phone_pay_number && (
            <div className="flex gap-2 text-white">
              <input
                type="radio"
                name="paymentMethod"
                value="4"
                checked={paymentMethod === "4"}
                onChange={() => setPaymentMethod("4")}
              />
              Phone Pe
            </div>
          )}
          {paymentData?.paytm_number && (
            <div className="flex gap-2 text-white">
              <input
                type="radio"
                name="paymentMethod"
                value="2"
                checked={paymentMethod === "2"}
                onChange={() => setPaymentMethod("2")}
              />
              Paytm
            </div>
          )}
          {paymentData?.upi_id && (
            <div className="flex gap-2 text-white">
              <input
                type="radio"
                name="paymentMethod"
                value="5"
                checked={paymentMethod === "5"}
                onChange={() => setPaymentMethod("5")}
              />
              UPI
            </div>
          )}
          {paymentData?.ac_number && (
            <div className="flex gap-2 text-white">
              <input
                type="radio"
                name="paymentMethod"
                value="1"
                checked={paymentMethod === "1"}
                onChange={() => setPaymentMethod("1")}
              />
              Bank Account
            </div>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="py-3 bg-orange-500 text-white font-bold rounded-lg w-full"
            onClick={userWithdrawFundRequest}
          >
            Withdraw
          </button>
        </div>
      </div>
    );
  };

  const history = () => {
    return withdrawHistory.map((item, index) => {
      let statusClass = "text-info";
      let statusText = "Pending";
      if (item.request_status === 2) {
        statusText = "Approved";
        statusClass = "text-success";
      } else if (item.request_status === 1) {
        statusText = "Rejected";
        statusClass = "text-danger";
      }

      return (
        <div className="bg-gray-800 p-4 rounded-lg mb-4 shadow-lg" key={index}>
          <div className="flex justify-between text-white">
            <div>{item.insert_date}</div>
            <div>{item.request_amount}₹</div>
          </div>
          <div className={`flex justify-between text-yellow-300 mt-2`}>
            <div>
              {methodCodes[item?.payment_method]}{" "}
              {item[paymentKeys[methodCodes[item?.payment_method]]] || ""}
            </div>
            <div className={statusClass}>{statusText}</div>
          </div>
        </div>
      );
    });
  };

  const renderValues = {
    0: withdraw,
    1: history,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
        <ConditionalDownloadButton />
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl mx-auto mt-5">
        <h3 className="text-3xl font-bold text-orange-500 text-center mb-6">
          Withdraw Funds
        </h3>
        {renderTypes()}
        {renderValues[active]()}

        {/* Render the modal */}
        <ProfileUpdateConfirmation
          isVisible={modalVisible}
          onClose={handleCloseModal}
        />

        <Loader show={loading} />
      </div>
    </div>
  );
};

export default Withdraw;
