import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { getSetData } from "@/utils";
import { setHeaderTitle } from "@/redux/slice";
import { useDispatch } from "react-redux";
import {
  Home,
  Person,
  AccountBalanceWallet,
  AddCircle,
  CreditCard,
  History,
  EmojiEvents,
  Notifications,
  Lock,
  BarChart,
  Help,
  Support,
  Share,
  ExitToApp,
  FacebookOutlined,
  Instagram,
  ShareOutlined
} from "@mui/icons-material";
import { FaThreads, FaYoutube } from "react-icons/fa6";

export const SideBar = ({ setActive }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  let isLoggedIn = !!getSetData("token");

  const handleLogout = () => {
    localStorage?.clear();
    router.push("/signup");
    router.reload();
    toast.success("Logout...");
  };

  let { user_name: name, mobile: phone } = getSetData("userData", undefined, true);

  let sidebarItems = [
    { link: "/", title: "Home", Icon: Home },
    { link: "/my-profile", title: "My Profile", checkLogin: true, Icon: Person },
    { divider: true },
    { link: "/wallet", title: "Wallet", Icon: AccountBalanceWallet },
    { link: "/add-fund", title: "Add Points", Icon: AddCircle },
    { link: "/payment-methods", title: "Add Bank Details", Icon: CreditCard },
    { link: "/withdraw", title: "Withdraw", Icon: AccountBalanceWallet },
    { divider: true },
    { link: "/bidding-history", title: "Bid History", Icon: History },
    { link: "/win-history", title: "Win History", Icon: EmojiEvents },
    { divider: true },
    { link: "/notifications", title: "Notifications", Icon: Notifications },
    { divider: true },
    { link: "/change-password", title: "Change Password", Icon: Lock },
    { link: "/game-rates", title: "Game Rates", Icon: BarChart },
    { link: "/howtoplay", title: "How To Play", Icon: Help },
    { link: "/support", title: "Help & Support", Icon: Support },
    { link: "https://www.facebook.com/profile.php?id=61564633610663&mibextid=ZbWKwL", title: "Facebook", Icon: FacebookOutlined },
    { link: "https://www.instagram.com/jodi.play?igsh=YXNwMzFqcXJyOWNs", title: "Instagram", Icon:Instagram, },
    { link: "https://www.youtube.com/@JodiPlay-u5b", title: "Youtube", Icon: FaYoutube, color: '#FF0000' },
    { link: "https://www.threads.net/@jodi.play", title: "Threads", Icon: FaThreads },
    { link: "https://sharechat.com/profile/jodiplay?d=n", title: "ShareChat", Icon: ShareOutlined, color: '#EE2A7B' },
    { type: "button", title: "Logout", onClick: handleLogout, Icon: ExitToApp },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex">
      <div className="w-72 bg-white shadow-xl h-full flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 bg-blue-600 text-white">
          <div>
            <p className="font-bold">{name || "Guest"}</p>
            <p className="text-sm">{phone || "No number"}</p>
          </div>
          <button onClick={() => setActive(false)}>
            <ArrowBackIcon className="text-white" />
          </button>
        </div>
        <ul className="flex-1 px-3 py-2">
          {sidebarItems.map((item, index) => (
            item.divider ? (
              <hr key={index} className="my-2 border-gray-300" />
            ) : (
              <li key={index} className="mb-1">
                {item.type === "button" ? (
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-gray-100"
                  >
                    <item.Icon className="text-red-600" />
                    <span className="font-medium">{item.title}</span>
                  </button>
                ) : (
                  <Link
                    href={item.link}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setActive(false);
                      dispatch(setHeaderTitle("JODI PLAY"));
                    }}
                  >
                    <item.Icon className="text-blue-600" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}
              </li>
            )
          ))}
        </ul>
      </div>
      <div className="flex-1" onClick={() => setActive(false)}></div>
    </div>
  );
};
