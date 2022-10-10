import React from "react";

const InfoBox = ({ title, info }) => {
  return (
    <div className='alert alert-warning' role='alert'>
      <h6 className='alert-heading'>{title}</h6>
      <hr />
      <p className='mb-0'>{info}</p>
    </div>
  );
};

export default InfoBox;
