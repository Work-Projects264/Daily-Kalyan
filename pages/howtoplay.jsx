import React, { useEffect, useState } from "react";

function Howtoplay() {
  // Static Data
  const playData = {
    image_file: "/rajdhani.png", // Replace with your image URL
    how_to_play_content: `
      <h2 class="text-2xl font-bold text-orange-500 mb-3">How to Play</h2>
      <ol class="list-decimal pl-6">
        <li class="mb-2">Download our online Matka app  DAILY KALYAN.</li>
        <li class="mb-2">Sign up and deposit money. You can start with a 100 deposit  or 200 deposit Matka app download.</li>
        <li class="mb-2">Pick your lucky numbers from the chart.</li>
        <li class="mb-2">Wait for the results! If you guess right, you win.</li>
      </ol>
    `,
    video_link: "https://www.youtube.com/watch?v=your-video-link", // Replace with actual video link
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-6">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-3xl w-full relative overflow-hidden">
        {/* Image Section */}
        <div className="mb-6">
          <a href="https://backend.jodiplay.com/logo/Jodi_Play.apk" download>
            <img
              src="banner-img.png"
              alt="How to Play Image"
              className="rounded-lg w-full object-cover h-80"
            />
          </a>
        </div>

        {/* Text Content */}
        <div
          dangerouslySetInnerHTML={{
            __html: playData.how_to_play_content || "",
          }}
          className="text-gray-300 mb-6 text-lg"
        />

        {/* Button Section */}
        <div className="flex justify-center">
          <a href={playData.video_link}>
            <button className=" rounded-lg shadow-lg bg-orange-500 text-white py-2 px-6 hover:bg-orange-600 transition duration-300">
              Watch Video
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Howtoplay;
