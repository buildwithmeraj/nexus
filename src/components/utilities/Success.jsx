import { CircleCheckBig } from "lucide-react";
import React from "react";

const SuccessMsg = ({ message }) => {
  return (
    <div className="flex items-center justify-center">
      <div role="alert" className="alert alert-success alert-soft mt-2 w-fit">
        <CircleCheckBig size={18} />
        {message}
      </div>
    </div>
  );
};

export default SuccessMsg;
