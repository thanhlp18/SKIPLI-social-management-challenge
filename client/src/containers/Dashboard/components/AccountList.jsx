import React from "react";
import NavbarDashboard from "./Navbar/Navbar";
import Account from "./Account";
import { useSelector } from "react-redux";
import logo from "../../../assets/logo.svg";

function AccountList(props) {
  const account = useSelector((state) => state.facebookLogin);
  console.log(account);
  return (
    <div>
      <NavbarDashboard />
      <div className="xs:grid-cols-1 grid  gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Account socialType={"Facebook"} />
        <Account socialType={"Instagram"} />
        <Account socialType={"Twitter"} />
      </div>
    </div>
  );
}

export default AccountList;
