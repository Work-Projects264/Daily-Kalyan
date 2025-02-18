import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ApiClient from "@/api/apiClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/redux/slice";
import Link from "next/link";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DehazeIcon from "@mui/icons-material/Dehaze";
import StarIcon from "@mui/icons-material/Star";
import ConditionalDownloadButton from "../ConditionalDownloadButton";
import Image from "next/image";

const GaliDesawar = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderTitle("GALI DESAWAR"));
    fetchInfo();
  }, []);

  const fetchInfo = () => {
    setLoading(true);
    ApiClient.galiGames()
      .then((res) => setInfo(res?.data))
      .catch(() => setLoading(false))
      .finally(() => setLoading(false));
  };

  const renderHeader = () => (
    <div className="p-4 flex flex-col items-center gap-4 my-6 bg-gray-900 text-white shadow-lg rounded-xl w-full">
      <ConditionalDownloadButton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-md">
        {/* Game Rates Button */}
        <Link
          href="/galidesawar/game-rates"
          className="flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow hover:bg-green-700 transition transform hover:scale-105"
        >
          <CurrencyRupeeIcon className="mr-3 text-2xl sm:text-3xl" />
          <span className="text-sm sm:text-base">Game Rates</span>
        </Link>
  
        {/* Win History Button */}
        <Link
          href="/galidesawar/win-history"
          className="flex items-center justify-center px-6 py-3 bg-yellow-600 text-white font-semibold rounded-full shadow hover:bg-yellow-700 transition transform hover:scale-105"
        >
          <StarIcon className="mr-3 text-2xl sm:text-3xl" />
          <span className="text-sm sm:text-base">Win History</span>
        </Link>
  
        {/* Bid History Button */}
        <Link
          href="/galidesawar/bidding-history"
          className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow hover:bg-red-700 transition transform hover:scale-105"
        >
          <DehazeIcon className="mr-3 text-2xl sm:text-3xl" />
          <span className="text-sm sm:text-base">Bid History</span>
        </Link>
      </div>
    </div>
  );
  

  const renderGames = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-3">
        {info?.result.map((game, index) => {
          const isClosed = game?.msg_status > 1;
          const { game_name, game_id, close_result, open_result } = game;

          return (
            <div
              key={index}
              className={`flex flex-col bg-gray-800 rounded-lg shadow-lg hover:shadow-xl p-4 transition-all duration-300 ${
                isClosed ? "bg-red-100" : "bg-green-100"
              }`}
              style={{ height: "auto", minHeight: "220px" }}
            >
              {/* Game Name */}
              <div className="text-center mb-4">
                <a
                  href={`/games/${game_id}`}
                  className="text-lg font-semibold text-orange-600 hover:text-orange-400"
                >
                  {game_name}
                </a>
              </div>

              <div className="font-semibold text-sm text-gray-400 mb-2">
                {open_result || "XXX - X"} {close_result || "X - XXX"}
              </div>

              {/* Bottom Section with Chart Icon, Status, and Play/Closed Button side by side */}
              <div className="flex justify-between items-center mb-4">
                {/* Chart Icon */}
                <div className="flex items-center justify-center">
                  <Link
                    href={`https://backend.jodiplay.com/gali-game-result-chart/${game.game_id}`}
                    target="_blank"
                  >
                    <div className="bg-gray-200 rounded-full  flex items-center justify-center w-30 h-20">
                      <Image
                        src={"/chart.png"}
                        width={50}
                        height={50}
                        alt="chart"
                        className="mx-auto"
                      />
                    </div>
                  </Link>
                </div>

                {/* Status (LIVE or Bid Closed) */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Red Dot for LIVE Status */}
                  {isClosed && (
                    <div className="text-md bg-red-600 text-white rounded-full py-1 px-2 opacity-60">
                      Market Status: Closed
                    </div>
                  ) }
                  {/* Bid Status Text */}
                  <p className="text-lg mt-3 text-green-500">
                    {!isClosed &&  "Market Status: Running"}
                  </p>
                </div>

                {/* Play/Closed Button */}
                <div
                  className={`game-play rounded-full w-16 h-16 flex flex-col p-3 items-center justify-center ${
                    !isClosed ? "cursor-pointer" : ""
                  } ${isClosed ? "bg-red-500" : "bg-green-500"}`}
                  onClick={() => {
                    const route = isClosed ? "/login" : `/game-dashboard/${game_name}/${game_id}`;
                    if (!isClosed) {
                      router.push({
                        pathname: route,
                        query: { data: JSON.stringify(game) },
                      });
                    }
                  }}
                >
                  <PlayCircleIcon className="text-4xl text-center  text-white" />
                  <p className="text-white text-sm">{isClosed ? "Closed":"Play"}</p>
                </div>
              </div>

              {/* Open and Close Times */}
              <div className="flex justify-between items-center mt-auto">
                

                {/* Close Time */}
                <div className="text-xs text-gray-500 pr-4">
                  Close: {game?.open_time || "N/A"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-black">
      {renderHeader()}
      {loading ? <Loader show={loading} /> : renderGames()}
    </div>
  );
};

export default GaliDesawar;
