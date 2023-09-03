export const loginFacebookApi = (facebookAuth, phoneNumber) => {
  return new Promise((resolve, reject) => {
    // Create a JSON object with the phone number
    const requestBody = {
      facebook: { ...facebookAuth },
      phoneNumber: phoneNumber,
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

export const getPostFacebook = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    // Create a JSON object with the phone number

    fetch("http://localhost:3001/get-facebook-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber: phoneNumber }), // Send the JSON data in the request body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // response: {userData: {name, id}, posts: [{id, message, full picture, description, isFavorite},...]}
        return response.json();
      })
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createFavoritePostApi = (phoneNumber, social, postId) => {
  fetch("http://localhost:3001/create-favorite-post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      postId: postId,
      phoneNumber: phoneNumber,
      social: social,
    }), // Send the JSON data in the request body
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  });
};
