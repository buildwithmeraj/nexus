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
  FaFacebookF,
} from "react-icons/fa";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import { BsTwitterX } from "react-icons/bs";
import { Link } from "react-router";
import { MdDescription } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="footer px-[1%] md:px-[3%] bg-base-200 text-base-content">
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
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-primary bg-gray-800 p-2 rounded-full text-white"
              >
                <BsTwitterX size={26} />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="text-red-600 hover:text-primary bg-white p-2 rounded-full"
              >
                <TbBrandYoutubeFilled size={26} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="text-white hover:text-primary bg-blue-600 p-2 rounded-full"
              >
                <FaFacebookF size={26} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-white hover:text-primary bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-2 rounded-full"
              >
                <FaInstagram size={26} />
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="text-white hover:text-primary bg-[#010101] border-l-2 border-[#25F4EE] border-r-2 border-[#FE2C55] p-2 rounded-full"
              >
                <FaTiktok size={26} />
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
