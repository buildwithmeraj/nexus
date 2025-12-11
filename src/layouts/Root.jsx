import React from "react";
import Navbar from "../components/shared/Navbar";
import { Outlet } from "react-router";
import Footer from "../components/shared/Footer";
import { Toaster } from "react-hot-toast";

const Root = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar />
      </header>
      <main className="grow container mx-auto px-4">
        <Outlet />
      </main>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Footer />
    </div>
  );
};

export default Root;
