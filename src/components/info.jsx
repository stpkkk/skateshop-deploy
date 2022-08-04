import React from "react";
import AppContext from "./../context";

const Info = ({ width, height, title, image, description }) => {
  const { onCloseСart } = React.useContext(AppContext);
  return (
    <div className="cartEmpty d-flex align-center justify-center flex-column flex">
      <img
        className="mb-20"
        width={width}
        height={height}
        src={image}
        alt="Empty"
      />
      <h2>{title}</h2>
      <p className="opacity-6">{description}</p>
      <button onClick={onCloseСart} className="greenButton">
        <img src="/img/arrow-left.svg" alt="Back" />
        Back
      </button>
    </div>
  );
};

export default Info;
