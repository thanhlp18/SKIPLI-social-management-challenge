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

    fetch("http://localhost:3001/get-instagram-page-posts", {
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
        // response: //-----> Expect: Array[{id, caption, media_url, isFavorite, timestamp, permalink},...]
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

export const createSocialPost = async (
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
  // CREATE POST STATUS
  var postStatus = {};
  // CREATE post with photo
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
    // Call api to create a facebook post
    try {
      if (selectSocial.facebook) {
        const response = await fetch(
          "http://localhost:3001/create-facebook-post-with-photo",
          {
            method: "POST",
            body: formData,
          }
        );
        const status = await response.json(); //{success: true}
        postStatus = { ...postStatus, facebook: status };
      }
      // Call api to create a instagram post
      if (selectSocial.instagram) {
        const response = await fetch(
          "http://localhost:3001/create-an-instagram-post",
          {
            method: "POST",
            body: formData,
          }
        );
        const status = await response.json();
        return status;
      }
      // Call api to create a twitter post
      // if (selectSocial.twitter) {
      //   const response = await fetch(
      //     "http://localhost:3001/create-facebook-post-with-photo",
      //     {
      //       method: "POST",
      //       body: formData,
      //     }
      //   );
      //   const status = await response.json();
      //   return status;
      // }
      return postStatus;
    } catch (error) {
      console.error("Can't post the api to create the post:", error);
    }
  }
  // CREATE post WITHOUT photo
  else {
    try {
      // CREATE A POST IN FACEBOOK
      if (selectSocial.facebook) {
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
      }

      // CREATE A POST IN INSTAGRAM -> Throw error, instagram required image for posting
      // if (selectSocial.facebook) {
      //   const response = await fetch(
      //     "http://localhost:3001/create-facebook-post",
      //     {
      //       method: "POST",
      //       body: JSON.stringify({
      //         phoneNumber: phoneNumber,
      //         message: message,
      //         isScheduled: scheduleDate.isScheduled,
      //         scheduledPublishTime: Math.floor(
      //           scheduleDate.scheduledPublishTime / 1000
      //         ),
      //       }),
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   );
      //   const status = await response.json();
      // }

      // CREATE A POST IN TWITTER
      // if (selectSocial.facebook) {
      //   const response = await fetch(
      //     "http://localhost:3001/create-facebook-post",
      //     {
      //       method: "POST",
      //       body: JSON.stringify({
      //         phoneNumber: phoneNumber,
      //         message: message,
      //         isScheduled: scheduleDate.isScheduled,
      //         scheduledPublishTime: Math.floor(
      //           scheduleDate.scheduledPublishTime / 1000
      //         ),
      //       }),
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   );
      //   const status = await response.json();
      // }
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
