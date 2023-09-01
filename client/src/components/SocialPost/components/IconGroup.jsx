import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "@material-tailwind/react";

IconGroup.propTypes = {
  icon: PropTypes.elementType.isRequired,
  data: PropTypes.string,
  type: PropTypes.string,
};

function IconGroup(props) {
  const { icon, data, type } = props;
  return (
    <Tooltip
      content={`${data ? data : ""} ${
        data && data > 1 ? type + "s" : type
      }`.toLocaleLowerCase()}
    >
      <div className=" flex items-center py-2 text-gray-900 transition-colors sm:gap-1 lg:gap-0.5 xl:gap-1">
        {icon ? icon : ""}
        {data ? data : ""}
      </div>
    </Tooltip>
  );
}

export default IconGroup;
