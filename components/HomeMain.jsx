import Link from "next/link";
import Info from "./Info";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ApiClient from "@/api/apiClient";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Loader from "./Loader";
import { useRouter } from "next/router";
import { getSetData } from "@/utils";
import { bgImage } from "@/resources/images";
import ModalComponent from "./Moda";
import Howtoplay from "@/pages/howtoplay";
import { useSelector } from "react-redux";
import { withdrawlicon } from "@/resources/images";
import { setContactDetails } from "@/redux/slice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import ConditionalDownloadButton from "@/pages/ConditionalDownloadButton";
import { FaDownload } from "react-icons/fa"; // Import Download Icon

const HomeMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const modalVisibleDetails = getSetData("closeModal");

  const [data, setData] = useState({});
  const [datawl, setDatawl] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [SlidingText, setSlidingText] = useState(null);
  const [contactDetails, setContactDetailsData] = useState({});
  const router = useRouter();
  const query = router.query;

  const reduxData = useSelector((state) => state?.data);
  const { contact_details } = reduxData;
  const dispatch = useDispatch();

  let info = data?.result || [];
  let infowl = datawl?.result || [];

  useEffect(() => {
    const checkAuth = () => {
      const token = getSetData("token");
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    setModalVisible(!modalVisibleDetails);
  }, [modalVisibleDetails]);

  const getContactData = () => {
    ApiClient.getContactDetails()
      .then((res) => {
        if (res?.data?.data && res?.data?.data[0]) {
          let data = res?.data?.data[0];
          dispatch(setContactDetails(data));
          setContactDetailsData(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInfo();
    } else {
      fetchpublicGames();
    }
    fetChImages();

    getContactData();
  }, [isAuthenticated]);

  // useEffect(() => {
  //   if (query.welcomesound === "true" && audioRef.current) {
  //     audioRef.current
  //       .play()
  //       .then(() => {
  //         router.replace(router.pathname, undefined, { shallow: true });
  //       })
  //       .catch((error) => {
  //         console.error("Audio playback failed:", error);
  //       });
  //   }
  // }, [query.welcomesound, router]);

  useEffect(() => {
    if (query.transaction === "true") {
      Swal.fire({
        title: "Success!",
        text: "Payment Successful!",
        icon: "success",
      });
    } else if (query.transaction === "false") {
      Swal.fire({
        title: "Oops!",
        text: "Payment Failed!",
        icon: "error",
      });
    }

    if (query.transaction) {
      const newUrl =
        router.pathname +
        router.asPath.replace(/(\?|&)transaction=[^&]*(&|$)/, "$1");
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [query.transaction]);

  const fetchInfo = () => {
    setLoading(true);
    ApiClient.dashbordInfo()
      .then((res) => {
        setData(res?.data);
        let newData = structuredClone(res?.data);
        delete newData.result;
        getSetData("basicDetails", newData || {}, true);
      })
      .catch((error) => {
        console.error("Error fetching dashboard info:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchpublicGames = () => {
    ApiClient.indexPageGames()
      .then((res) => {
        setDatawl({ result: res.data.game_result });
      })
      .catch((error) => {
        console.error("Error fetching public games:", error);
      });
  };

  const fetchSliderText = () => {
    ApiClient.getSliderText({
      app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8",
    })
      .then((res) => {
        setSlidingText(res.data.content.newsText);
      })
      .catch((err) => {
        console.error("Error fetching slider text:", err);
      });
  };

  const fetChImages = () => {
    ApiClient.homeSliderImages({
      app_key: "@34@Y#456)D9)(JE4dsj36f$%#(jodiplay!com)8fe8345*&^ef8ef8",
    })
      .then((res) => {
        if (res?.data?.status && Array.isArray(res.data.sliderdata)) {
          setSliderImages(res.data.sliderdata);
        } else {
          console.error("Invalid slider data format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching slider images:", err);
      });
  };

  const getMarketTimes = (a) => {
    return {
      openTime: a?.open_time || "N/A",
      closeTime: a?.close_time || "N/A",
    };
  };

  const showInfoModal = () => {
    if (!isAuthenticated) {
      return <></>;
    }
    return (
      <ModalComponent
        setShow={(res) => {
          setModalVisible(res);
          getSetData("closeModal", !res);
        }}
        show={modalVisible}
      >
        <Howtoplay />
      </ModalComponent>
    );
  };

  const formatGameResult = (game) => {
    const { openNumber, openResult, closeResult, closeNumber } = game;

    const format = (value, defaultValue) => {
      if (value === "***") return "XXX";
      if (value === "*") return "X";
      if (value === "0" || value === 0) return "0";
      return value || defaultValue;
    };

    const formattedOpen = format(openNumber, "XXX");
    const formattedOpenResult = format(openResult, "X");
    const formattedCloseResult = format(closeResult, "X");
    const formattedClose = format(closeNumber, "XXX");

    return `${formattedOpen} - ${formattedOpenResult} ${formattedCloseResult} - ${formattedClose}`;
  };

  const renderGameswithoutlogin = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {infowl.map((game, index) => {
          const isClosed =
            new Date() >
            new Date(`${new Date().toDateString()} ${game.closeTime}`);
          const { game_name, game_url, openTime, closeTime } = game;

          const slug = game_url.split("/").pop();

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
                  href={`/games/${slug}`}
                  className="text-lg font-semibold text-orange-600 hover:text-orange-400"
                >
                  {game_name}
                </a>
              </div>

              <div className="font-semibold text-sm text-gray-400 mb-2">
                {formatGameResult(game)}
              </div>

              {/* Bottom Section with Chart Icon, Status, and Play/Closed Button side by side */}
              <div className="flex justify-between items-center mb-4">
                {/* Chart Icon */}
                <div className="flex items-center justify-center">
                  <Link
                    href={isAuthenticated ? `${game.web_chart_url}` : "/login"}
                    target={isAuthenticated ? "_blank" : ""}
                  >
                    <div className="bg-gray-200 rounded-full  flex items-center justify-center w-30 h-20">
                      <Image
                        src={"/Chart.png"}
                        width={50}
                        height={50}
                        alt="chart"
                        className="mx-auto"
                      />
                    </div>
                  </Link>
                </div>

                {/* Status (LIVE or Bid Closed) */}
                <div className="flex items-center justify-center mr-14 space-x-2">
                  {/* Red Dot for LIVE Status */}
                  {isClosed && (
                    <div className="text-md ml-14 bg-red-600 text-white rounded-full py-1 px-2 opacity-60">
                      Market status: Closed
                    </div>
                  )}
                  {/* Bid Status Text */}
                  <p className="text-lg mt-3 ml-16 text-green-500">
                    {isClosed ? "" : "Market status: Open"}
                  </p>
                </div>

                {/* Play/Closed Button */}
                <div
                  className={`game-play rounded-full w-16 h-16 flex flex-col  items-center justify-center ${
                    !isClosed && isAuthenticated ? "cursor-pointer" : ""
                  } ${isClosed ? "" : ""}`}
                  onClick={() => {
                    if (!isClosed && isAuthenticated) {
                      router.push({
                        pathname: `/game-dashboard/${game_name}`,
                        query: { data: JSON.stringify(game) },
                      });
                    } else if (!isAuthenticated) {
                      window.location.href =
                        "https://backend.jodiplay.com/logo/daily_kalyan.apk";
                    }
                  }}
                >
                  <div className="flex flex-col items-center space-y-1 hover:cursor-pointer">
                    {/* Play Icon - Always White */}
                    <PlayCircleIcon className="text-4xl text-black" />

                    {/* Status Text with Background Color */}
                    <p
                      className={`px-4 py-1 rounded-lg text-sm font-semibold text-white ${
                        isClosed
                          ? "bg-red-500"
                          : "bg-green-500 hover:bg-green-600 cursor-pointer"
                      }`}
                    >
                      {isClosed ? "Closed" : "Play"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Open and Close Times */}
              <div className="flex justify-between items-center mt-auto">
                {/* Open Time */}
                <div className="text-xs text-gray-500 pl-4">
                  Open: {openTime}
                </div>

                {/* Close Time */}
                <div className="text-xs text-gray-500 pr-4">
                  Close: {closeTime}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGames = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-3">
        {info?.map((game, index) => {
          let isClosed = game?.msg_status > 1;
          let { game_name, game_id, close_result, open_result } = game;
          const { openTime, closeTime } = getMarketTimes(game);

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
                <span className="text-lg font-semibold text-orange-600 hover:text-orange-400">
                  {game_name}
                </span>
              </div>

              <div className="font-semibold text-sm text-gray-400 mb-2">
                {open_result || "XXX - X"}
                {close_result || "X - XXX"}
              </div>

              {/* Bottom Section with Chart Icon, Status, and Play/Closed Button side by side */}
              <div className="flex justify-between items-center mb-4">
                {/* Chart Icon */}
                <div className="flex items-center justify-center">
                  <Link
                    href={isAuthenticated ? `${game.web_chart_url}` : "/login"}
                    target={isAuthenticated ? "_blank" : ""}
                  >
                    <div className="bg-gray-200 rounded-full  flex items-center justify-center w-20 h-20">
                      <Image
                        src={"/chart.png"}
                        width={50}
                        height={50}
                        alt="chart"
                      />
                    </div>
                  </Link>
                </div>

                {/* Status (LIVE or Bid Closed) */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Red Dot for LIVE Status */}
                  {isClosed && (
                    <div className="text-xs bg-red-600 text-white rounded-full py-1 px-2 opacity-60">
                      Market status: Closed
                    </div>
                  )}
                  {/* Bid Status Text */}
                  <p className="text-lg mt-3 text-green-500">
                    {isClosed ? "" : "Market status: Open"}
                  </p>
                </div>

                {/* Play/Closed Button */}
                <div
                  className={`w-20 h-20 flex flex-col items-center justify-center rounded-full  transition-transform duration-300 ${
                    isClosed
                      ? " opacity-80 cursor-not-allowed"
                      : " hover:scale-105 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!isClosed) {
                      let route = isAuthenticated
                        ? `/game-dashboard/${game_name}/${game_id}`
                        : "/login";
                      router.push({
                        pathname: route,
                        query: { data: JSON.stringify(game) },
                      });
                    }
                  }}
                >
                  <div className="flex flex-col items-center space-y-1 hover:cursor-pointer">
                    {/* Play Icon - Always White */}
                    <PlayCircleIcon className="text-4xl text-black" />

                    {/* Status Text with Background Color */}
                    <p
                      className={`px-4 py-1 rounded-lg text-sm font-semibold text-white ${
                        isClosed
                          ? "bg-red-500"
                          : "bg-green-500 hover:bg-green-600 cursor-pointer"
                      }`}
                    >
                      {isClosed ? "Closed" : "Play"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Open and Close Times */}
              <div className="flex justify-between items-center mt-auto">
                {/* Open Time */}
                <div className="text-xs text-gray-500 pl-4">
                  Open: {openTime || "NA"}
                </div>

                {/* Close Time */}
                <div className="text-xs text-gray-500 pr-4">
                  Close: {closeTime || "NA"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // const renderCarousel = () => {
  //   if (!sliderImages?.length) {
  //     return <></>;
  //   }

  //   return sliderImages.map((item, index) => {
  //     return (
  //       <div
  //         className={`carousel-item ${index === 0 ? "active" : ""}`}
  //         key={item.image_id}
  //         style={{ height: "40dvh" }}
  //       >
  //         <Link
  //           href={item.slider_link || "#"}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           <img
  //             src={item.slider_image || ""}
  //             className="d-block w-100"
  //             alt={`Slider image ${item.image_id}`}
  //             style={{ height: "48dvh", width: "100dvw", objectFit: "fill" }}
  //           />
  //         </Link>
  //       </div>
  //     );
  //   });
  // };

  if (isLoading) {
    return <Loader show={true} />;
  }

  return (
    <div
      className={`maxWidth px-3 ${
        !isAuthenticated ? "showbackgroundnl" : "bg-gray-700  "
      }`}
    >
      {isAuthenticated ? (
        <div className="d-flex my-3 justify-content-between">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
            className="yellow-gradient text-large1 stol-500"
            id="scroll-text"
          >
            <marquee
              behavior="scroll"
              direction="left"
              scrollamount="10" /* Adjust speed */
              style={{
                fontSize: "1.2rem",
                color: "#00659e",
                whiteSpace: "nowrap",
              }}
            >
              {SlidingText} &nbsp;&nbsp;&nbsp; {SlidingText}
            </marquee>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {!isAuthenticated && (
        <a href="https://backend.jodiplay.com/logo/daily_kalyan.apk">
          <div className="fixed bottom-0 left-0 w-full px-4 z-40 bg-blue-600 overflow-hidden">
            <button className="relative w-full flex items-center justify-center text-white font-bold py-3 rounded-lg shadow-md transition hover:bg-blue-700">
              {/* Left Icon */}
              <FaDownload className="absolute left-4 text-3xl text-white" />

              {/* Main Content */}
              <span className="text-lg font-semibold">
                Download App to Play
              </span>

              {/* Right Icon */}
              <FaDownload className="absolute right-4 text-3xl text-white" />

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-white opacity-10 animate-shine"></div>
            </button>
          </div>
        </a>
      )}

      {/* {showInfoModal()} */}

      {!isAuthenticated && (
        <section className="d-lg-none sm-d-block sectionhome">
          <div className="container">
            <div className="row">
              <div
                style={{ marginTop: "25px" }}
                className="col-12 text-center sm-heading"
              >
                <div className="stol-400 stol-400 text-small1">
                  India's Most Trusted Matka Play App
                </div>
                <div
                  className="yellow-gradient text-large1 stol-500"
                  id="scroll-text"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      animation: "scrollText 20s linear infinite",
                      fontSize: "1.2rem",
                    }}
                  >
                    Welcome to Daily Kalyan - Online Matka play
                  </div>
                </div>
              </div>
              <div className="col-12 text-center mt-4">
                {/* <Link href="/login"> */}
                <img
                  src="banner-img.png"
                  alt="banner Image"
                  className="policy-shadow-mobile mt-3 w-95 h-95"
                />
                {/* </Link> */}
                <a
                  href="https://backend.jodiplay.com/logo/daily_kalyan.apk"
                  download
                >
                  <div className="static_downloadbtn__empire btn-style sm-no-margin ">
                    <p className="downloadp">Download App</p>
                  </div>
                </a>
                <div
                  id="androidParagraph"
                  className="android-paragraph text-white pt-1 stol-b text-13"
                  style={{ display: "block" }}
                >
                  <p style={{ color: "#ffce41" }}>For Better User Experience</p>
                </div>
                
              </div>
            </div>
          </div>
        </section>
      )}

      <div>
        {/* <div
          style={{ marginTop: "0px" }}
          id="carouselExampleAutoplaying"
          className="carousel slide"
          data-bs-ride="carousel"
        > */}
        {/* <div className="carousel-inner">{renderCarousel()}</div> */}
        {/* <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button> */}
        {/* </div> */}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-3 p-3">
        {/* Large Screens - Full Buttons */}
        <div className="hidden sm:flex justify-between w-full gap-3">
          {/* Add Points */}
          <Link
            href="add-fund"
            className="flex items-center justify-center font-bold w-full gap-2 px-4 py-3 
             bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 
             rounded-lg shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-yellow-600
             transition-all duration-300"
          >
            <img src={"/money.png"} className="h-5" alt="money" />
            <span>Add Points</span>
          </Link>

          {/* WhatsApp */}
          <Link
            href={contact_details?.whatsapp_no || "#"}
            className="flex items-center justify-center font-bold w-full gap-2 px-4 py-3 
             bg-gradient-to-r from-green-500 to-green-600 text-white 
             rounded-lg shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700
             transition-all duration-300"
          >
            <img src={"/whatsapp.png"} className="h-5" alt="whatsapp" />
            <span>WhatsApp</span>
          </Link>

          {/* Withdrawal */}
          <Link
            href={isAuthenticated ? "/withdraw" : "/login"}
            className="flex items-center justify-center font-bold w-full gap-2 px-4 py-3 
             bg-gradient-to-r from-red-500 to-red-600 text-white 
             rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700
             transition-all duration-300"
          >
            <img src={withdrawlicon} className="h-5" alt="Withdrawal" />
            <span>Withdrawal</span>
          </Link>
        </div>

        {/* Small Screens - Compact Icons */}
        <div className="sm:hidden flex justify-center items-center gap-x-4 w-full">
          <Link
            href="add-fund"
            className="bg-yellow-500 p-3 rounded-full w-20 h-20 flex justify-center items-center shadow-md"
          >
            <img src={"/money.png"} className="h-10" alt="money" />
          </Link>

          <Link
            href={contact_details?.whatsapp_no || "#"}
            className="bg-green-500 p-3 rounded-full w-20 h-20 flex justify-center items-center shadow-md"
          >
            <img src={"/whatsapp.png"} className="h-10" alt="whatsapp" />
          </Link>

          <Link
            href={isAuthenticated ? "/withdraw" : "/login"}
            className="bg-red-500 p-3 rounded-full w-20 h-20 flex justify-center items-center shadow-md"
          >
            <img src={withdrawlicon} className="h-10" alt="Withdrawal" />
          </Link>
        </div>
      </div>

      {!isAuthenticated ? (
        <></>
      ) : (
        <Link
          href={isAuthenticated ? "/galidesawar" : "/login"}
          className="flex justify-center items-center text-center font-semibold w-full mb-4 px-5 py-3 
             rounded-md bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md 
             hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300"
        >
          Gali Desawar Market
        </Link>
      )}
      {!isAuthenticated ? (
        <>
          <div className="text-center">{renderGameswithoutlogin()}</div>
          <Info />
        </>
      ) : (
        <div className="text-center">{renderGames()}</div>
      )}

      <Loader show={loading} />
    </div>
  );
};

export default HomeMain;
