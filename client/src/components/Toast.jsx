import "aos/dist/aos.css";
import clsx from "clsx";
import React from "react";

function Toasts(props) {
  const { type, description, className } = props;

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

  console.log("render");
  return (
    <div
      id="toast"
      className={clsx(
        "round-sm p-2 text-center",
        color[type].primary,
        className
      )}
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
