import React, { useState, useEffect } from "react";
import ApiClient from "@/api/apiClient";
import { useRouter } from "next/router";
import { getDaysDifference, getMonthsDifference, getSetData } from "@/utils";
import Loader from "@/components/Loader";
import Inputbox from "@/components/common/Inputbox";
import ConditionalDownloadButton from "../ConditionalDownloadButton";

function WinHistory({ setDates, data, gali }) {
  const [winningRecords, setWinningRecords] = useState(data || []);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    setWinningRecords(data || []);
  }, [data]);

  useEffect(() => {
    const checkUserToken = getSetData("token");
    if (!checkUserToken) {
      router.push("/signup");
    }
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      if (setDates) {
        setDates({ bid_from: startDate, bid_to: endDate });
      } else {
        fetchWinningRecords();
      }
    }
  }, [startDate, endDate, setDates]);

  useEffect(() => {
    handleDateRangeChange("today");
  }, []);

  const handleDateRangeChange = (range) => {
    let dates;
    switch (range) {
      case "today":
        dates = getDaysDifference(0);
        break;
      case "last7days":
        dates = getDaysDifference(7);
        break;
      case "last30days":
        dates = getDaysDifference(30);
        break;
      case "lastMonth":
        dates = getMonthsDifference(1);
        break;
      case "last3Months":
        dates = getMonthsDifference(3);
        break;
      default:
        break;
    }
    if (dates) {
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    }
  };

  const fetchWinningRecords = () => {
    setLoading(true);
    const { user_id } = getSetData("userData", false, true);
    ApiClient.winHistory({ date_from: startDate, date_to: endDate, user_id })
      .then((res) => {
        setWinningRecords(res?.data?.win_data || []);
      })
      .catch((error) => {
        console.error("Error fetching Winning records:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderWinningRecords = () => {
    return winningRecords.map((item, index) => (
      <div key={index} className="border-2 border-yellow-400 rounded-lg p-4 mb-4 shadow-lg bg-gray-900 text-white">
        <div className="text-orange-500 text-xl font-bold text-center mb-2">{item.game_name}</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {!gali && <div><strong className="text-yellow-300">Session:</strong> {item.session}</div>}
          {!gali && <div><strong className="text-yellow-300">Open Digit:</strong> {item.digits}</div>}
          <div><strong className="text-yellow-300">{gali ? "Digit" : "Close Digit"}:</strong> {item.closedigits}</div>
          <div><strong className="text-yellow-300">Amount:</strong> {item.amount}</div>
          <div><strong className="text-yellow-300">Game Type:</strong> {item.pana}</div>
          <div><strong className="text-yellow-300">Date and Time:</strong> {item.wining_date}</div>
        </div>
      </div>
    ));
  };

  return (
    
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
       <ConditionalDownloadButton />
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-3xl mt-4">
        <h3 className="text-3xl font-bold text-orange-500 text-center mb-4">Winning History</h3>
        <div className="flex flex-col gap-3 mb-6">
          <Inputbox
            className="w-full"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(value) => setStartDate(value)}
          />
          <Inputbox
            className="w-full"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(value) => setEndDate(value)}
          />
        </div>
        <div className="max-h-96 overflow-y-auto">
          {winningRecords.length === 0 ? (
            <p className="text-center text-gray-400">No Record Found.</p>
          ) : (
            renderWinningRecords()
          )}
        </div>
      </div>
      <Loader show={loading} />
    </div>
    
  );
}

export default WinHistory;
