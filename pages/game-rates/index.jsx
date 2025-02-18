import ApiClient from "@/api/apiClient";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import { Skeleton } from "@mui/material"; // Import Skeleton from Material-UI

const GameRates = ({ data }) => {
  const [gameratesData, setGameRatesData] = useState(data || []);
  const [loading, setLoading] = useState(true); // Add loading state

  const getGameRates = () => {
    setLoading(true); // Set loading to true before fetching data
    ApiClient.gameRates()
      .then((res) => {
        setGameRatesData(res?.data?.game_rates);
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); // Ensure loading is set to false even on error
      });
  };

  useEffect(() => {
    if (data) {
      setGameRatesData(data);
      setLoading(false); // If data is passed, set loading to false
    }
  }, [data]);

  useEffect(() => {
    if (!data) {
      getGameRates();
    }
  }, []);

  let genrateData = (data, keys) => {
    let strArr = [];
    keys.map((item) => {
      let arr = item.split("_");

      if (arr.includes("val")) {
        arr.pop();
        arr.pop();
        let str = arr.join("_");
        strArr.push(str);
      }
    });

    let final = [...new Set(strArr)];

    let result = [];

    final.map((item) => {
      let finalStr1 = item + "_val_1";
      let finalStr2 = item + "_val_2";
      let key = [data[finalStr1], data[finalStr2]];
      let object = { [item.replaceAll("_", " ")]: key };
      result.push(object);
    });

    return result;
  };

  const renderGameRates = () => {
    if (loading) {
      return Array(4) // Adjust the number of skeletons as needed
        .fill()
        .map((_, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-4 rounded-lg shadow-md text-white transition transform hover:scale-105 hover:shadow-lg border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Skeleton variant="text" height={30} />
            <Skeleton variant="text" height={30} width="60%" />
          </motion.div>
        ));
    }

    let obj = gameratesData[0];
    if (!obj) {
      return <div>No record found!</div>;
    }
    let games = Object.keys(obj);

    let data = genrateData(obj, games);

    return data.map((game, index) => {
      let key = Object.keys(game)[0];
      let val = game[key];
      return (
        <motion.div
          key={index}
          className="bg-gray-800 p-4 rounded-lg shadow-md text-white transition transform hover:scale-105 hover:shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold text-yellow-400 flex items-center">
               {key}
            </span>
            <span className="font-semibold text-green-400">
              {val[0]} - {val[1]}
            </span>
          </div>
        </motion.div>
      );
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-6">
      <motion.div
        className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-3xl w-full relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      >
        <h2 className="text-3xl font-bold text-orange-500 text-center mb-6 relative">
          Game Rates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderGameRates()}
        </div>
      </motion.div>
    </div>
  );
};

export default GameRates;
