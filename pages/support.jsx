import { whatsappIcon } from "@/resources/images";
import EmailIcon from "@mui/icons-material/Email";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import React from "react";
import { useSelector } from "react-redux";

function Support() {
  const reduxData = useSelector((state) => state?.data);
  const { contact_details } = reduxData;

  const contactOptions = [
    {
      href: contact_details?.contact_details,
      icon: <img src={whatsappIcon} className="w-6 h-6" />, 
      label: "Whatsapp",
      bgColor: "bg-green-600",
    },
    {
      href: "tel://" + contact_details?.mobile_1,
      icon: <LocalPhoneIcon className="text-green-400" fontSize="large" />, 
      label: "Call",
      bgColor: "bg-gray-700",
    },
    {
      href: `mailto:${contact_details?.email_1}`,
      icon: <EmailIcon className="text-red-400" fontSize="large" />, 
      label: "Email",
      bgColor: "bg-gray-700",
    },
    {
      href: contact_details?.youtube,
      icon: <YouTubeIcon className="text-red-500" fontSize="large" />, 
      label: "YouTube",
      bgColor: "bg-red-700",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-5 p-6 bg-gray-900 text-white">
      {contactOptions.map((option, index) => (
        <a
          key={index}
          target="_blank"
          rel="noopener noreferrer" // Added for security
          href={option.href}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${option.bgColor} hover:opacity-80 cursor-pointer w-80 justify-center`}
        >
          {option.icon}
          <span className="text-lg font-medium">{option.label}</span>
        </a>
      ))}
    </div>
  );
}

export default Support;
