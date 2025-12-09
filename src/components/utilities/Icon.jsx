import React from "react";
import icon from "../../assets/icon.png";

const Icon = ({ classes }) => {
  return (
    <>
      <img src={icon} alt="Icon" className={classes} />
    </>
  );
};

export default Icon;
