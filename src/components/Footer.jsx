import React from "react";

const Footer = () => {
  return (
    <div className='fixed-bottom'>
      <div
        className='text-center'
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        © 2022 Copyright:
        <span className='text-dark ms-5'>Django.com</span>
      </div>
    </div>
  );
};

export default Footer;
