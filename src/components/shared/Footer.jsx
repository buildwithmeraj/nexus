import React from "react";
import Icon from "../utilities/Icon";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router";
import { MdDescription } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer px-10 bg-base-200 text-base-content">
      <div className="mx-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-10 lg:justify-items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3 justify-center lg:justify-normal">
              <Icon classes="w-12" />
              <h2 className="text-xl font-bold">
                {import.meta.env.VITE_SITE_NAME}
              </h2>
            </div>
            <div className="text-sm text-base-content/70 ">
              {import.meta.env.VITE_SITE_NAME} is a community-driven platform
              connecting clubs and members through events, memberships, and
              shared experiences.
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Contact</h3>

            <div className="space-y-2 text-sm text-base-content/70">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-primary" />
                contact@nexus.io
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-primary" />
                +880 1995489248
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                Remote • Worldwide
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-center">Company</h3>
            <div className="space-y-2 text-sm text-base-content/70">
              <p className="flex items-center gap-2">
                <Link to="/about" className="">
                  <MdDescription
                    className="inline mb-0.5 text-primary mr-2"
                    size={16}
                  />
                  About Us
                </Link>
              </p>
              <p className="flex items-center gap-2">
                <Link to="/terms" className="">
                  <MdDescription
                    className="inline mb-0.5 text-primary mr-2"
                    size={16}
                  />
                  Terms of Service
                </Link>
              </p>
              <p className="flex items-center gap-2">
                <Link to="/privacy" className="">
                  <MdDescription
                    className="inline mb-0.5 text-primary mr-2"
                    size={16}
                  />
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div className="space-y-4 md:justify-self-end">
            <h3 className="text-lg font-semibold text-center">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter" className="hover:text-primary">
                <BsTwitterX size={26} />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="text-red-600 hover:text-primary"
              >
                <TbBrandYoutubeFilled size={34} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="text-blue-500 hover:text-primary"
              >
                <FaFacebook size={30} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-red-500 hover:text-primary"
              >
                <FaInstagram size={32} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-900 hover:text-primary"
              >
                <FaTiktok size={28} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-4 border-t border-base-300 text-base-content/80 w-full">
          <p className="text-center">
            © {new Date().getFullYear()} {import.meta.env.VITE_SITE_NAME}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
