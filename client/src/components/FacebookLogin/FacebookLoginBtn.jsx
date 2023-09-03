import React, { useCallback, useEffect, useState } from "react";
import LoginSocialFacebook from "./LoginSocialFacebook";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { FacebookLoginButton } from "react-social-login-buttons";

// REDIRECT URL must be same with URL where the (reactjs-social-login) components is locate
// MAKE SURE the (reactjs-social-login) components aren't unmounted or destroyed before the ask permission dialog closes
const REDIRECT_URI = window.location.href;

const App = (props) => {
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
    <div
      className={clsx(`App ${provider && profile ? "hide" : ""}`, className)}
    >
      <LoginSocialFacebook
        isOnlyGetToken={false}
        scope={"public_profile,user_posts"}
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
      >
        <FacebookLoginButton className="w-96" />
      </LoginSocialFacebook>
    </div>
  );
};

export default App;
