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
