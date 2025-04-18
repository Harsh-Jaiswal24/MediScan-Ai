import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function Nav() {
  return (
    <nav className="w-full flex-wrap mt-4 mb-6 pl-6 pr-6 gap-5 font-semibold flex items-center justify-between">
     <div className="flex flex-row gap-5 justofy-center items-center ">
     <NavLink to="/">
        <img
          src={Logo}
          className="mr-0 w-10 h-10 bg-zinc-400 rounded-full object-cover"
        />
      </NavLink><NavLink to="/" className="text-xl">MediScan Ai</NavLink>
     </div>
     <div className="flex justify-center itmes-center gap-5">
     <NavLink
        to="/"
        className={(e) => {
          if (e.isActive == true) return "text-red-500";
          else return "";
        }}
      >
        Home
      </NavLink>
      <NavLink
        to="/about"
        className={(e) => {
          if (e.isActive == true) return "text-red-500";
          else return "";
        }}
      >
        About
      </NavLink>
      <SignedIn>
      <NavLink to='/allreports' className={(e)=>{
        if(e.isActive==true) return 'text-red-500'
        else return "";
      }}>
      Reports</NavLink>
      </SignedIn>
     </div>
     <div className="flex justify-center itmes-center ">
     <SignedOut>
     <SignInButton/>
     </SignedOut>
     <SignedIn>
     <UserButton />
      </SignedIn>
     </div>
    </nav>
  );
}

export default Nav;
