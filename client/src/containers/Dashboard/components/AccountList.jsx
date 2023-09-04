import React, { useEffect, useState } from "react";
import NavbarDashboard from "./Navbar/Navbar";
import Account from "./Account";
import { useSelector } from "react-redux";
import logo from "../../../assets/logo.svg";
import { getSocialAccount } from "../../../api/socialApi";

function AccountList(props) {
  const skipliAccount = JSON.parse(localStorage.getItem("skipliAccount"));
  const [socialAccounts, setSocialAccounts] = useState([]);

  useEffect(() => {
    getSocialAccount(skipliAccount.userPhoneNumber)
      .then((data) => {
        setSocialAccounts(data);
      })
      .catch((error) => {
        console.error("Error fetching social account data: ", error);
      });
  }, []);

  return (
    <div>
      <NavbarDashboard />
      <div className="xs:grid-cols-2 grid  gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {socialAccounts.map((account, index) => (
          <Account
            socialPlatform={account.socialPlatform}
            profileImage={account.profileImage}
            userName={account.userName}
            key={`social-account-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

export default AccountList;
