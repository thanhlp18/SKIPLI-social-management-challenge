import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

function BtnLoading(props) {
  const { className, type, text } = props;
  return (
    <>
      <button
        type={type}
        className={clsx(
          "flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          className
        )}
      >
        {text}
      </button>
    </>
  );
}

export default BtnLoading;
