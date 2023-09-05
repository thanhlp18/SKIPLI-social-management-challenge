import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import {
  getSocialAccount,
  getSocialAccountLoginStatus,
} from "../../../api/socialApi";
import Account from "./Account";

function AccountList(props) {
  const navigate = useNavigate();
  const skipliAccount = JSON.parse(localStorage.getItem("skipliAccount"));
  const [socialAccounts, setSocialAccounts] = useState([]);
  const [loginStatus, setLoginStatus] = useState([
    {
      socialPlatform: "facebook",
      isLogin: false,
      message: "",
    },
    {
      socialPlatform: "instagram",
      isLogin: false,
      message: "",
    },
    {
      socialPlatform: "twitter",
      isLogin: false,
      message: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Check whether use login skipli account, if false, navigate use to login page
  useEffect(() => {
    if (skipliAccount) {
      getSocialAccount(skipliAccount.userPhoneNumber)
        .then((data) => {
          setSocialAccounts(data);
        })
        .catch((error) => {
          console.error("Error fetching social account data: ", error);
        });
      setIsLoading(false);
      const fetchData = async () => {
        try {
          const response = await getSocialAccountLoginStatus(
            skipliAccount.userPhoneNumber
          );
          setLoginStatus(response);
          var isLoginSocial = false;
          response.map((social, index) => {
            if (social.isLogin) {
              isLoginSocial = true;
            }
          });
          // If user doen't login any social account, navigate them to accounts list
          if (!isLoginSocial) navigate("/accounts");
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      navigate("/login");
    }
  }, []);

  console.log("Accounts List: ", socialAccounts);

  return (
    <div className="flex h-full flex-col items-start justify-start">
      {/* <NavbarDashboard /> */}
      <h1 className="px-4 pt-4 text-lg font-semibold ">
        Login to your social accounts
      </h1>
      {isLoading ? (
        <div className=" flex h-[60%] w-full flex-col items-center justify-center pb-24">
          <ReactLoading color={"#000"} height={"8rem"} width={"8rem"} />
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="font-medium">Get ready for some awesomeness!</span>
            <span>Your post is coming to you 💌🌟🚀✨</span>
          </div>
        </div>
      ) : (
        <div className="xs:grid-cols-2 grid  gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {socialAccounts.map((account, index) => (
            <Account
              socialPlatform={account.socialPlatform}
              profileImage={account.profileImage}
              userName={account.userName}
              key={`social-account-${index}`}
              isLogin={account.isLogin}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AccountList;
