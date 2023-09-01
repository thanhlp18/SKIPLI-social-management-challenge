export const loginFacebookApi = (phoneNumber, accessToken, provider) => {
  return new Promise((resolve, reject) => {
    // Create a JSON object with the phone number
    const requestBody = {
      phoneNumber: phoneNumber,
      accessToken: accessToken,
      provider: provider,
    };

    fetch("http://localhost:3001/loginFacebook", {
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
