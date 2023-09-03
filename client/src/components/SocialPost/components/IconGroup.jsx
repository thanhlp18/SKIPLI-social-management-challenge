import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-tailwind/react";
import clsx from "clsx";

function IconGroup(props) {
  const { icon, data, type, className } = props;
  return (
    <Tooltip
      content={`${data ? data : ""} ${
        data && data > 1 ? type + "s" : type
      }`.toLocaleLowerCase()}
    >
      <div
        className={clsx(
          "flex items-center text-gray-900 transition-colors sm:gap-1 lg:gap-0.5 xl:gap-1",
          className
        )}
      >
        {icon ? icon : ""}
        {data ? data : ""}
      </div>
    </Tooltip>
  );
}

export default IconGroup;
