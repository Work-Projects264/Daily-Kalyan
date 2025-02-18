import SubjectIcon from "@mui/icons-material/Subject";
import ApiClient from "@/api/apiClient";
import { SideBar } from "./SideBar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSetData } from "@/utils";
import { walletIcon } from "@/resources/images";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/redux/slice";
import { useRouter } from "next/router";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [active, setActive] = useState(false);
  const [headerTitle, setHeaderTitle] = useState("DAILY KALYAN");
  const [amount, setAmount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check login status
  const checkAuthStatus = () => {
    const token = getSetData("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    setIsClient(true);
    checkAuthStatus();
  }, []);

  // Re-check authentication on route change
  useEffect(() => {
    const handleRouteChange = () => {
      checkAuthStatus();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  // Fetch wallet amount when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const { user_id } = getSetData("userData", false, true);
      const fetchWalletAmount = () => {
        ApiClient.wallet_amount({ user_id })
          .then((res) => setAmount(res?.data?.wallet_amt || 0))
          .catch((error) => console.error("Error fetching wallet amount:", error));
      };

      fetchWalletAmount();
      const intervalId = setInterval(fetchWalletAmount, 10000);
      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn]);

  // Set dynamic header titles based on routes
  useEffect(() => {
    const routeTitles = {
      "/": "DAILY KALYAN",
      "/wallet": "Wallet",
      "/signup": "Register",
      "/my-profile": "My Profile",
      "/add-fund": "Add Funds",
      "/payment-methods": "Payment Methods",
      "/withdraw": "Withdraw",
      "/bidding-history": "Bid History",
      "/win-history": "Winning History",
      "/notifications": "Notifications",
      "/change-password": "Change Password",
      "/game-rates": "Game Rates",
      "/howtoplay": "How to Play",
      "/support": "Support",
    };
    setHeaderTitle(routeTitles[router.pathname] || "DAILY KALYAN");
  }, [router.pathname]);

  return (
    <>
      {/* Sidebar */}
      {isClient && isLoggedIn && active && <SideBar setActive={setActive} />}

      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 w-full z-20 bg-[#00659e] shadow-md p-3">
        <div className="flex items-center">
          
          {/* Sidebar Toggle */}
          {isClient && isLoggedIn && (
            <button
              onClick={() => setActive(!active)}
              className="text-white mr-3 focus:outline-none"
            >
              <SubjectIcon className="text-white" />
            </button>
          )}

          {/* Header Title */}
          <Link
            href="/"
            className="text-white font-bold text-lg"
            onClick={() => dispatch(setHeaderTitle(headerTitle))}
          >
            {headerTitle || "DAILY KALYAN"}
          </Link>

          {/* Wallet or Login/Register Buttons */}
          <div className="ml-auto">
            {isClient &&
              (isLoggedIn ? (
                <Link href="/wallet" className="flex items-center">
                  <img src={walletIcon} alt="Wallet" className="w-8 h-8" />
                  <span className="text-white ml-2">₹{amount}</span>
                </Link>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-md transition hover:bg-orange-600"
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-md transition hover:bg-orange-600"
                  >
                    Login
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </nav>
      
      {/* Spacing to prevent content from being hidden under the navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
