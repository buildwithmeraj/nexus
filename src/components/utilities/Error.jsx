import { CircleX } from "lucide-react";
import React from "react";

const ErrorMsg = ({ message }) => {
  return (
    <div className="flex items-center justify-center">
      <div role="alert" className="alert alert-error alert-soft mt-2 w-fit">
        <CircleX size={18} />
        {message}
      </div>
    </div>
  );
};

export default ErrorMsg;
