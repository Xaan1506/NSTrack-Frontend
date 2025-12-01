import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import "@/styles/smooth-scroll.css";
import { initSmoothScrolling } from "@/utils/smoothScroll";
import App from "@/App";

// Initialize smooth scrolling
if (typeof window !== 'undefined') {
  // Add a small delay to ensure the DOM is fully loaded
  const init = () => {
    initSmoothScrolling();
    
    // Add smooth scrolling class to the body
    document.body.classList.add('smooth-scroll');
    
    // Add smooth scrolling to the main container
    const main = document.querySelector('main');
    if (main) {
      main.classList.add('scroll-container');
    }
  };
  
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
}

// Sanitize localStorage values that are the literal strings 'undefined' or 'null'
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    Object.keys(localStorage).forEach((key) => {
      const v = localStorage.getItem(key);
      if (typeof v === 'string') {
        const t = v.trim();
        if (t === 'undefined' || t === 'null') {
          localStorage.removeItem(key);
          console.debug(`Sanitized localStorage key: ${key}`);
        }
      }
    });
  } catch (e) {
    // ignore
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
