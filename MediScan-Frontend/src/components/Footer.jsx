import React from 'react';
import { FaLinkedin, FaGithub, FaInstagram ,FaGoogle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-teal-600 text-white py-10 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-2">MediScan</h2>
          <p className="text-sm text-teal-100">
            AI-powered health insights for a healthier tomorrow.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/symptom-check" className="hover:underline">Symptom Checker</Link></li>
           
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://www.linkedin.com/in/harsh-jaiswal-93755a2a7/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-200"><FaLinkedin /></a>
            <a href="https://github.com/Harsh-Jaiswal24" target="_blank" rel="noopener noreferrer" className="hover:text-teal-200"><FaGithub /></a>
            <a href="https://www.instagram.com/harsh_jais2005/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-200"><FaInstagram /></a>
          <a href="mailto:harsh4jaiswal@gmail.com?subject=Inquiry%20from%20MediScan%20Visitor" target="_blank" className="hover:text-teal-200"><FaGoogle /></a>
    
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-teal-100 mt-8 border-t border-teal-500 pt-4">
        &copy; {new Date().getFullYear()} MediScan. All rights reserved. <br></br>Designed & Developed by Harsh Jaiswal
      </div>
     
        
      
    </footer>
  );
};

export default Footer;
