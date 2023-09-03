import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FacebookLoginButton } from "react-social-login-buttons";
import LoginSocialFacebook from "./LoginSocialFacebook";

// REDIRECT URL must be same with URL where the (reactjs-social-login) components is locate
// MAKE SURE the (reactjs-social-login) components aren't unmounted or destroyed before the ask permission dialog closes
const REDIRECT_URI = window.location.href;

const FacebookLoginBtn = (props) => {
  const { className } = props;
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);
  const facebookLogin = useSelector((state) => state.facebookLogin.value);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Facebook Login Redux: ", facebookLogin);
  }, []);

  const onLoginStart = useCallback(() => {
    alert("login start");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    alert("logout success");
  }, []);

  const onLogout = useCallback(() => {}, []);
  // console.log(profile);

  return (
    <LoginSocialFacebook
      isOnlyGetToken={false}
      scope={
        "public_profile,user_posts,pages_manage_cta,pages_show_list,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_ads,pages_manage_posts,pages_manage_engagement"
      }
      appId={process.env.REACT_APP_FACEBOOK_APP_API || ""}
      onLoginStart={onLoginStart}
      onResolve={({ provider, data }) => {
        setProvider(provider);
        setProfile(data);
      }}
      cookie={true}
      return_scopes={true}
      onLogoutSuccess={onLogoutSuccess}
      onReject={(err) => {
        console.log(err);
      }}
      className={"flex"}
    >
      <FacebookLoginButton
        className=" max-h-[40px] w-full flex-1 rounded-full text-xs"
        style={{
          margin: "0",
          borderRadius: "0 0 0.75rem 0.75rem",
          fontSize: "inherit",
        }}
      />
    </LoginSocialFacebook>
  );
};

export default FacebookLoginBtn;
