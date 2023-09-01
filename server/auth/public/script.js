window.fbAsyncInit = function () {
  FB.init({
    appId: "1476109913180602",
    autoLogAppEvents: true,
    xfbml: true,
    version: "v17.0",
  });
};

document
  .querySelector(".fb-login-button")
  .addEventListener("click", function () {
    FB.login(function (response) {
      if (response.authResponse) {
        // User is logged in, handle the response
        console.log("Logged in:", response);
        // You can make API requests or redirect the user to another page here
      } else {
        // User canceled login or did not grant permissions
        console.log("Login canceled");
      }
    });
  });

FB.getLoginStatus(function (response) {
  statusChangeCallback(response);
});
