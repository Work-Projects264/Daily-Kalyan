import React from "react";

const TrustedSection = () => {
  return (
    <div className="bg-black py-16 px-6 text-center relative overflow-hidden">
      {/* Gold Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 opacity-10 blur-3xl"></div>

      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 animate-shimmer mb-4">
        Trusted by Thousands
      </h2>

      <p className="text-2xl font-bold text-yellow-300 drop-shadow-md mb-6">
        Play with Confidence on{" "}
        <span className="text-yellow-500 font-extrabold">Daily Kalyan</span> – The Ultimate Online Matka Platform
      </p>

      <p className="max-w-2xl mx-auto text-lg text-gray-300 drop-shadow-lg">
        Daily Kalyan is a premier platform offering a <span className="text-yellow-400">secure, transparent,</span> and
        seamless online matka experience. With instant deposits and withdrawals,{" "}
        <span className="text-yellow-400">fair play policies</span>, and dedicated customer support, we ensure a safe
        and rewarding gaming environment. Join thousands of players who trust{" "}
        <span className="text-yellow-400">Daily Kalyan</span> for its reliability, integrity, and real-money winnings.
      </p>

      {/* Subtle Gold Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-lg"></div>
    </div>
  );
};

export default TrustedSection;
