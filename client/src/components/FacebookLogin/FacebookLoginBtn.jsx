import React, { useCallback, useState } from "react";
import LoginSocialFacebook from "./LoginSocialFacebook";

// CUSTOMIZE ANY UI BUTTON
import { FacebookLoginButton } from "react-social-login-buttons";
import { loginFacebookApi } from "../../api/socialApi";

// REDIRECT URL must be same with URL where the (reactjs-social-login) components is locate
// MAKE SURE the (reactjs-social-login) components aren't unmounted or destroyed before the ask permission dialog closes
const REDIRECT_URI = window.location.href;

const App = () => {
  const [provider, setProvider] = useState("");
  const [profile, setProfile] = useState(null);

  const onLoginStart = useCallback(() => {
    alert("login start");
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider("");
    alert("logout success");
  }, []);

  const onLogout = useCallback(() => {}, []);

  return (
    <div className={`App ${provider && profile ? "hide" : ""}`}>
      <h1 className="title">ReactJS Social Login</h1>
      <LoginSocialFacebook
        isOnlyGetToken={false}
        appId={process.env.REACT_APP_FACEBOOK_APP_API || ""}
        onLoginStart={onLoginStart}
        onResolve={({ provider, data }) => {
          setProvider(provider);
          setProfile(data);
        }}
        scope={"public_profile"}
        cookie={true}
        // return_scopes={true}
        onLogoutSuccess={onLogoutSuccess}
        onReject={(err) => {
          console.log(err);
        }}
      >
        <FacebookLoginButton />
        <button onClick={onLogout}>Logout</button>
      </LoginSocialFacebook>
    </div>
  );
};

export default App;
