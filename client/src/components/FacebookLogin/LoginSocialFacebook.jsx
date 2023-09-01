/* eslint-disable camelcase */
/**
 *
 * LoginSocialFacebook
 *
 */
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { loginFacebookApi } from "../../api/socialApi";
import { useSelector } from "react-redux";

const SDK_URL = "https://connect.facebook.net/en_EN/sdk.js";
const SCRIPT_ID = "facebook-jssdk";
const _window = window;

const LoginSocialFacebook = ({
  appId,
  scope = "email,public_profile",
  state = true,
  xfbml = true,
  cookie = true,
  version = "v2.7",
  language = "en_EN",
  auth_type = "",
  className,
  onLoginStart,
  onReject,
  onResolve,
  redirect_uri,
  fieldsProfile = "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender",
  response_type = "code",
  return_scopes = true,
  isOnlyGetToken = false,
  children,
}) => {
  const scriptNodeRef = useRef(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const phoneNumber = useSelector((state) => state.phoneNumber.value);

  useEffect(() => {
    !isSdkLoaded && load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSdkLoaded]);

  useEffect(
    () => () => {
      if (scriptNodeRef.current) scriptNodeRef.current.remove();
    },
    []
  );

  const insertSDKScript = useCallback((document, cb) => {
    const fbScriptTag = document.createElement("script");
    fbScriptTag.id = SCRIPT_ID;
    fbScriptTag.src = SDK_URL;
    const scriptNode = document.getElementsByTagName("script")[0];
    scriptNode &&
      scriptNode.parentNode &&
      scriptNode.parentNode.insertBefore(fbScriptTag, scriptNode);
    cb();
  }, []);

  const checkIsExistsSDKScript = useCallback(() => {
    return !!document.getElementById(SCRIPT_ID);
  }, []);

  const initFbSDK = useCallback((config, document) => {
    _window.fbAsyncInit = function () {
      _window.FB && _window.FB.init({ ...config });
      setIsSdkLoaded(true);
      let fbRoot = document.getElementById("fb-root");
      if (!fbRoot) {
        fbRoot = document.createElement("div");
        fbRoot.id = "fb-root";
        document.body.appendChild(fbRoot);
      }
      scriptNodeRef.current = fbRoot;
    };
  }, []);

  const getMe = useCallback(
    (authResponse) => {
      console.log("getme");
      _window.FB.api(
        "/me",
        { locale: language, fields: fieldsProfile },
        (me) => {
          onResolve({
            provider: "facebook",
            data: { ...authResponse, ...me },
          });
        }
      );
    },
    [fieldsProfile, language, onResolve]
  );

  const handleResponse = useCallback(
    (response) => {
      if (response.authResponse) {
        loginFacebookApi(
          phoneNumber,
          response.authResponse.accessToken,
          "facebook"
        );

        if (isOnlyGetToken)
          onResolve({
            provider: "facebook",
            data: { ...response.authResponse },
          });
        else getMe(response.authResponse);
      } else {
        onReject(response);
      }
      setIsProcessing(false);
    },
    [getMe, isOnlyGetToken, onReject, onResolve]
  );

  const load = useCallback(() => {
    if (checkIsExistsSDKScript()) {
      setIsSdkLoaded(true);
    } else {
      insertSDKScript(document, () => {
        initFbSDK(
          {
            appId,
            xfbml,
            version,
            state,
            cookie,
            redirect_uri,
            response_type,
          },
          document
        );
      });
    }
  }, [
    state,
    appId,
    xfbml,
    cookie,
    version,
    initFbSDK,
    redirect_uri,
    response_type,
    insertSDKScript,
    checkIsExistsSDKScript,
  ]);

  const loginFB = useCallback(() => {
    if (!isSdkLoaded || isProcessing) return;

    if (!_window.FB) {
      load();
      onReject("Fb isn't loaded!");
      setIsProcessing(false);
    } else {
      setIsProcessing(true);
      onLoginStart && onLoginStart();
      _window.FB.login(handleResponse, {
        scope,
        return_scopes,
        auth_type,
      });
    }
  }, [
    load,
    scope,
    onReject,
    auth_type,
    isSdkLoaded,
    onLoginStart,
    isProcessing,
    return_scopes,
    handleResponse,
  ]);

  const isLogIn = useCallback(() => {
    if (isSdkLoaded) {
      _window.FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          var accessToken = response.authResponse;
          console.log("da dang nhap: ", accessToken);
        } else {
          console.log("chua dang nhap!");
        }
      });
    }
  }, []);

  isLogIn();

  return (
    <div className={className} onClick={loginFB}>
      {children}
    </div>
  );
};

export default memo(LoginSocialFacebook);
