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
