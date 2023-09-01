import React from "react";
import { Outlet } from "react-router-dom";
import FacebookLoginBtn from "../../components/FacebookLogin/FacebookLoginBtn";
import Sidebar from "../../components/Sidebar";
import { useCookies } from "react-cookie";

Dashboard.propTypes = {};

function Dashboard(props) {
  // const [cookies, setCookie, removeCookie] = useCookies(["login"]);
  // console.log(cookies);
  return (
    <div className="grid grid-cols-5">
      <div>
        <FacebookLoginBtn />
        <Sidebar className="col-span-1" />
      </div>
      <div className="col-span-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
