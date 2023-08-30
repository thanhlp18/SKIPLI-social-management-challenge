import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import AOS from "aos";
import "aos/dist/aos.css";

function Toasts(props) {
  const label = {
    success: "Success",
    error: "Error",
  };

  const color = {
    success: {
      text: "text-emerald-50 ",
      primary: "bg-emerald-600",
      secondary: "bg-emerald-500",
    },
    error: {
      text: "text-red-50 ",
      primary: "bg-red-600",
      secondary: "bg-red-500",
    },
  };
  const { type, description, className } = props;

  useEffect(() => {
    setTimeout(() => {
      if (document.querySelector("#phone-number-toast"))
        document.querySelector("#phone-number-toast").classList.add("hidden");
    }, 4000);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 300,
    });
  }, []);
  return (
    <div
      id="phone-number-toast"
      className={clsx(
        "round-sm text-center transition delay-500 duration-1000  ease-in-out sm:w-screen sm:p-4 lg:w-full lg:p-2 ",
        color[type].primary,
        className
      )}
      data-aos="fade-down"
    >
      <div
        className={clsx(
          "flex items-center  p-3 leading-none sm:p-2  lg:rounded-full",
          color[type].secondary,
          color[type].text
        )}
        role="alert"
      >
        <span
          className={clsx(
            "mr-3 flex rounded-full px-2 py-1 text-xs font-bold uppercase",
            color[type].primary
          )}
        >
          {label[type]}
        </span>
        <span className="mr-2 flex-auto text-left font-semibold">
          {description}
        </span>
        {/* <svg
          className="h-4 w-4 fill-current opacity-75"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg> */}
      </div>
    </div>
  );
}

export default Toasts;
