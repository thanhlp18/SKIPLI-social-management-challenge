export const loginFacebookApi = (metaAuth, phoneNumber, socialPlatform) => {
  return new Promise((resolve, reject) => {
    // Create a JSON object with the phone number
    const requestBody = {
      socialPlatform: socialPlatform,
      meta: { ...metaAuth },
      phoneNumber: phoneNumber,
    };

    fetch("http://localhost:3001/login-meta", {
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

    fetch("http://localhost:3001/get-facebook-page-posts", {
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
        // console.log(data);
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createFacebookPost = async (
  image,
  message,
  phoneNumber,
  selectSocial,
  scheduleDate = { isScheduled: false, scheduledPublishTime: "" }
) => {
  const formData = new FormData();
  formData.append("message", message);
  formData.append("image", image);
  formData.append("phoneNumber", phoneNumber);
  if (image) {
    if (scheduleDate.isScheduled)
      return {
        success: false,
        message:
          "The feature to schedule posts with images is under development",
      };
    console.log("RUN WITH IMAGE");
    console.log("phoneNumber: ", phoneNumber);
    console.log("message: ", message);
    try {
      const response = await fetch(
        "http://localhost:3001/create-facebook-post-with-photo",
        {
          method: "POST",
          body: formData,
        }
      );
      const status = await response.json();
      return status;
    } catch (error) {
      console.error("Can't post the api to create the post:", error);
    }
  } else {
    try {
      const response = await fetch(
        "http://localhost:3001/create-facebook-post",
        {
          method: "POST",
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            message: message,
            isScheduled: scheduleDate.isScheduled,
            scheduledPublishTime: Math.floor(
              scheduleDate.scheduledPublishTime / 1000
            ),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const status = await response.json();

      return status;
    } catch (error) {
      console.error("Can't post the api to create the post:", error);
    }
  }
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

export const getSocialAccount = (phoneNumber) => {
  return fetch("http://localhost:3001/get-social-accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumber: phoneNumber,
    }), // Send the JSON data in the request body
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
      throw error;
    });
};

export const getSocialAccountLoginStatus = (phoneNumber) => {
  return fetch("http://localhost:3001/get-social-accounts-login-status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phoneNumber: phoneNumber,
    }), // Send the JSON data in the request body
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
      throw error;
    });
};
