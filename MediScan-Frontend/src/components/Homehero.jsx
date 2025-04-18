import React, { useEffect } from 'react';
import { Link,NavLink } from 'react-router-dom';
import { CiLocationArrow1 } from "react-icons/ci";
import { Bs1Circle, Bs2Circle , Bs3Circle  } from "react-icons/bs";
import heroImage from "../assets/heroImage.png"

const HomeHero = () => {
  
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-white px-6 py-9 flex flex-col md:flex-row items-center justify-between gap-16">
      {/* Left: Text Content */}
      <div className="flex flex-col max-w-xl">
        <h1 className="text-5xl font-extrabold leading-tight text-gray-800 mb-4">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            MediScan AI
          </span>
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          Diagnose smarter with our AI-powered symptom checker. In just 3 simple steps, manage your health confidently:
        </p>

        <ul className="space-y-2 text-gray-700 text-md mb-6">
          <li> <span className='text-cyan-600'><Bs1Circle /></span>  Select and describe your symptoms</li>
          <li><span className='text-cyan-600'><Bs2Circle /></span>  Upload images of skin-related conditions</li>
          <li><span className='text-cyan-600'><Bs3Circle /></span>  Get instant diagnosis, treatments & nearby hospital info</li>
        </ul>

        <NavLink
          to="/symptom-check"
          className="w-fit bg-teal-600 hover:bg-teal-700 text-white text-md font-semibold px-6 py-3 rounded-lg shadow transition"
        >
          Start Symptom Check
        </NavLink>

        <div className="mt-5 text-sm text-gray-500">
          <strong className="text-green-600">Excellent</strong> ★★★★★ Rated
        </div>
        <p className="mt-1 text-xs text-red-500 font-semibold italic">
          *This is an assistant tool. Always consult a healthcare provider for serious conditions.
        </p>
      </div>

      {/* Right: Phone Illustration */}
      <div className="w-full md:w-[40%] flex justify-center">
        <img
          src={heroImage} // Replace with your image or screenshot
          alt="AI Symptom Checker"
          className="w-[300px] md:w-[360px] rounded-xl shadow-2xl"
        />
      </div>
    </section>
  );
};

export default HomeHero;
