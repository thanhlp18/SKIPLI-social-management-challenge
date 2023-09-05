import React, { useCallback } from "react";
import { InstagramLoginButton } from "react-social-login-buttons";
import LoginSocialFacebook from "./LoginSocialFacebook";

// REDIRECT URL must be same with URL where the (reactjs-social-login) components is locate
// MAKE SURE the (reactjs-social-login) components aren't unmounted or destroyed before the ask permission dialog closes
const REDIRECT_URI = window.location.href;

const InstagramLoginBtn = (props) => {
  const { className, onLogin } = props;

  const onLoginStart = useCallback(() => {
    alert("login start");
  }, []);

  const onLogoutSuccess = useCallback(() => {
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
      socialPlatform="instagram"
      appId={process.env.REACT_APP_FACEBOOK_APP_API || ""}
      onLoginStart={onLoginStart}
      onResolve={({ provider, data }) => {
        onLogin(true);
      }}
      cookie={true}
      return_scopes={false}
      onLogoutSuccess={onLogoutSuccess}
      onReject={(err) => {
        console.log(err);
      }}
      className={"flex"}
    >
      <InstagramLoginButton
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

export default InstagramLoginBtn;
