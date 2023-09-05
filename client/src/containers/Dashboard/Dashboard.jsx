import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import FacebookLoginBtn from "../../components/FacebookLogin/FacebookLoginBtn";
import Sidebar from "../../components/Sidebar";

function Dashboard() {
  return (
    <div className="grid grid-cols-5 ">
      <div>
        {/* <FacebookLoginBtn /> */}
        <Sidebar className="col-span-1" />
      </div>
      <div className="col-span-4">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
