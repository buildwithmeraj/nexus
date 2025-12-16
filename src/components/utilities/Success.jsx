import { CircleCheckBig } from "lucide-react";
import React from "react";

const SuccessMsg = ({ message }) => {
  return (
    <div
      role="alert"
      className="alert alert-success alert-soft mt-2 text-lg p-4"
    >
      <CircleCheckBig size={18} />
      {message}
    </div>
  );
};

export default SuccessMsg;
