export const validatePhoneNumberApi = (inputPhoneNumber) => {
  const { phone, countryCode } = inputPhoneNumber;

  return new Promise((resolve, reject) => {
    fetch(
      `http://localhost:3001/validate-phone-number?phoneNumber=${phone}&countryCode=${countryCode}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const CreateNewAccessCode = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    // Create a JSON object with the phone number
    const requestBody = { phoneNumber };

    fetch("http://localhost:3001/generate-access-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Send the JSON data in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const validateAccessCode = (phoneNumber, accessCode) => {
  return new Promise((resolve, reject) => {
    // Create a JSON object with the phone number and access code
    const requestBody = { phoneNumber: phoneNumber, accessCode: accessCode };

    fetch("http://localhost:3001/validate-access-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Send the JSON data in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// export const getFacebookAuthCodeApi = async () => {
//   const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_API;
//   const redirectUri = process.env.REACT_APP_REDIRECT_URL;

//   try {
//     // Open Facebook login window
//     const authWindow = window.open(
//       `https://www.facebook.com/v17.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${redirectUri}`
//     );

//     // Function to handle the event when the Facebook login window sends a message
//     const handleWindowMessage = (event) => {
//       if (event.origin === window.location.origin) {
//         // Check if the event data contains the authorization code
//         if (event.data.authorizationCode) {
//           // Authorization code received, you can now use it
//           const authorizationCode = event.data.authorizationCode;
//           console.log("Authorization code:", authorizationCode);

//           // Remove the event listener
//           window.removeEventListener("message", handleWindowMessage);

//           // Close the authWindow
//           authWindow.close();
//         }
//       }
//     };

//     // Listen for changes in the authWindow
//     window.addEventListener("message", handleWindowMessage);
//   } catch (error) {
//     console.error("Facebook login error:", error);
//   }
// };
