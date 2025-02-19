import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const TestimonialInterface = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ravi Sharma",
      avatar:
        "https://zara777.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser_1.896b2edb.png&w=256&q=75",
      review:
        "Daily Kalyan is the most trusted Satta Matka platform! Fast withdrawals and fair play make it the best in the game.",
    },
    {
      id: 2,
      name: "Priya Verma",
      avatar:
        "https://zara777.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser_3.5db6a2a1.png&w=256&q=75",
      review:
        "I’ve been playing on Daily Kalyan for months, and I love how transparent and secure the platform is. No delays in payouts!",
    },
    {
      id: 3,
      name: "Amit Patel",
      avatar:
        "https://zara777.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fuser_2.0aafc030.png&w=256&q=75",
      review:
        "Best Satta Matka site! The deposit and withdrawal process is super smooth, and their support team is always helpful.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 bg-black hover:cursor-pointer">
      <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-4">
        What Our Players Say
      </h2>
      <p className="text-xl text-yellow-200 text-center mb-12">
        Join thousands of satisfied players winning big every day!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-900 text-white p-6 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 relative border-2 border-yellow-500"
            aria-label={`Testimonial from ${testimonial.name}`}
            tabIndex="0"
          >
            {/* Neon Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 opacity-20 blur-2xl"></div>

            <div className="flex items-start relative">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-yellow-400"
              />
              <div>
                <FaQuoteLeft className="text-yellow-400 mb-2 text-2xl" />
                <p className="text-gray-300 mb-4">{testimonial.review}</p>
                <p className="font-semibold text-yellow-400">{testimonial.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialInterface;
