import { Info } from "lucide-react";
import React from "react";

const InfoMSg = ({ message }) => {
  return (
    <div className="flex items-center justify-center">
      <div role="alert" className="alert alert-info alert-soft mt-2 w-fit">
        <Info size={18} />
        {message}
      </div>
    </div>
  );
};

export default InfoMSg;
