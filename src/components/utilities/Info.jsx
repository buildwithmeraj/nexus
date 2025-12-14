import { GrInfo } from "react-icons/gr";

const InfoMSg = ({ message }) => {
  return (
    <div role="alert" className="alert alert-info alert-soft mt-2 text-lg p-4">
      <GrInfo className="-mr-2" size={18} />
      {message}
    </div>
  );
};

export default InfoMSg;
