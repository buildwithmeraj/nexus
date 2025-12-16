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

const Footer = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300 px-4">
      <div className="mx-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 lg:justify-items-center">
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
                support@yourdomain.com
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-primary" />
                +1 (555) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                Remote • Worldwide
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

        <div className="mt-6 pt-4 border-t border-base-300 text-center text-base-content/60">
          © {new Date().getFullYear()} {import.meta.env.VITE_SITE_NAME}. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
