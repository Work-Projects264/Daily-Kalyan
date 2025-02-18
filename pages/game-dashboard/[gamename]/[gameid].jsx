import ConditionalDownloadButton from "@/pages/ConditionalDownloadButton";
import { setHeaderTitle } from "@/redux/slice";
import {
  double_pattifill,
  full_sangam_icon,
  half_sangam_icon,
  jodiDice_icon,
  single_pattifill,
  singlefill,
  triple_pattifill,
} from "@/resources/images";
import { isTimePast } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion"; // For animations
import { FaPlayCircle } from "react-icons/fa"; // For play icon

function GameDashboard() {
  const router = useRouter();
  const { gamename, gameid, data } = router.query;
  const dispatch = useDispatch();

  let gameData = {};

  if (data) {
    try {
      gameData = JSON.parse(data);
    } catch (e) {
      router.push("/");
      console.log(e);
    }
  }

  let { open_time } = gameData;

  let isOpenAll = "";
  if (open_time) isOpenAll = !isTimePast(open_time);

  useEffect(() => {
    if (isNaN(gameid) || !data) {
      router.push("/");
    }
    dispatch(setHeaderTitle(gamename));
  }, [gameid, data]);

  const renderCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          onClick={() => {
            router.push({
              pathname: `/game-dashboard/${gamename}/play/single-digit/${gameid}`,
              query: { data: data },
            });
          }}
          className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl p-4 transition-all duration-300 cursor-pointer"
        >
          <img src={singlefill} alt="Single Digit" className="mx-auto mb-2" />
          <p className="text-center text-gray-300">Single Digit</p>
        </motion.div>

        {isOpenAll && (
          <motion.div
            onClick={() => {
              router.push({
                pathname: `/game-dashboard/${gamename}/play/jodi-digit/${gameid}`,
                query: { data: data },
              });
            }}
            className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl p-4 transition-all duration-300 cursor-pointer"
          >
            <img src={jodiDice_icon} alt="Jodi" className="mx-auto mb-2" />
            <p className="text-center text-gray-300">Jodi</p>
          </motion.div>
        )}

        <motion.div
          onClick={() => {
            router.push({
              pathname: `/game-dashboard/${gamename}/play/single-panna/${gameid}`,
              query: { data: data },
            });
          }}
          className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl p-4 transition-all duration-300 cursor-pointer"
        >
          <img src={single_pattifill} alt="Single Patti" className="mx-auto mb-2" />
          <p className="text-center text-gray-300">Single Patti</p>
        </motion.div>

        <motion.div
          onClick={() => {
            router.push({
              pathname: `/game-dashboard/${gamename}/play/double-panna/${gameid}`,
              query: { data: data },
            });
          }}
          className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl p-4 transition-all duration-300 cursor-pointer"
        >
          <img src={double_pattifill} alt="Double Patti" className="mx-auto mb-2" />
          <p className="text-center text-gray-300">Double Patti</p>
        </motion.div>

        <motion.div
          onClick={() => {
            router.push({
              pathname: `/game-dashboard/${gamename}/play/triple-panna/${gameid}`,
              query: { data: data },
            });
          }}
          className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl p-4 transition-all duration-300 cursor-pointer"
        >
          <img src={triple_pattifill} alt="Triple Patti" className="mx-auto mb-2" />
          <p className="text-center text-gray-300">Triple Patti</p>
        </motion.div>

        {isOpenAll && (
          <>
            <motion.div
              onClick={() => {
                router.push({
                  pathname: `/game-dashboard/${gamename}/play/half-sangam/${gameid}`,
                  query: { data: data },
                });
              }}
              className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl p-4 transition-all duration-300 cursor-pointer"
            >
              <img src={half_sangam_icon} alt="Half Sangam" className="mx-auto mb-2" />
              <p className="text-center text-gray-300">Half Sangam</p>
            </motion.div>
            <motion.div
              onClick={() => {
                router.push({
                  pathname: `/game-dashboard/${gamename}/play/full-sangam/${gameid}`,
                  query: { data: data },
                });
              }}
              className="bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl p-4 transition-all duration-300 cursor-pointer"
            >
              <img src={full_sangam_icon} alt="Full Sangam" className="mx-auto mb-2" />
              <p className="text-center text-gray-300">Full Sangam</p>
            </motion.div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 text-white">
      <ConditionalDownloadButton />
      <div className="max-w-xl w-full border p-6 bg-gray-800 rounded-lg shadow-md mt-8">
        <h1 className="text-xl font-bold text-orange-500 text-center mb-4">{gamename} Dashboard</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Select Bidding Option</p>
        {renderCards()}
        <div className="text-xs text-center my-4 text-gray-400">Note: Betting is Running Now</div>
      </div>
    </div>
  );
}

export default GameDashboard;
