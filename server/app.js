// --------------
// Start express config
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
// End express config
const firebase = require("./firebase.js")();

// Start firebase config
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  setDoc,
  getDoc,
  doc,
  serverTimestamp,
  updateDoc,
} = require("firebase/firestore");
const firebaseConfig = require("./.firebaseConfig/firebaseConfig.json");
const { defineBoolean } = require("firebase-functions/params");
const { error } = require("firebase-functions/logger");
const firebaseStore = initializeApp(firebaseConfig);
const db = getFirestore(firebaseStore);
// End firebase config

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// -------------- method

//START OTP HANDLE

//Validate phone number when use input
app.get("/validate-phone-number", (req, res) => {
  const phoneNumber = req.query.phoneNumber;
  const countryCode = req.query.countryCode;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  client.lookups.v2
    .phoneNumbers(phoneNumber)
    .fetch({ countryCode: countryCode })
    .then((phone_number) => {
      const data = phone_number.toJSON();
      res.json(data); // Send the data back to the client
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" }); // Handle errors and send an error response
    });
});

// Generate a random 6-digit access code
function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Save the access code to the phone number in Firebase Realtime Database
app.post("/generate-access-code", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const timeStamp = serverTimestamp();
  const accessCode = generateAccessCode();

  // addDoc(collection(db, "users")
  try {
    const userRef = await updateDoc(doc(db, "users", phoneNumber), {
      accessCode: accessCode,
      createdDate: timeStamp,
    }).then(() => {
      res.json(accessCode); // Send the data back to the client
    });
    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

// Save the access code to the phone number in Firebase Realtime Database
app.post("/validate-access-code", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const accessCode = req.body.accessCode;

  try {
    // Look up and get the doc to the phone number of user
    const usersRef = doc(db, "users", phoneNumber);
    const docSnap = await getDoc(usersRef);

    // Compare the access code store in data base, return true and delete the access code if they input a valid OTP
    // else return false
    if (docSnap.data().accessCode === accessCode) {
      res.json(true);
      // set access code to empty string
      await updateDoc(usersRef, {
        accessCode: "",
      });
    } else {
      res.json(false);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

// END OTP handle

//START Facebook API handle
// Facebook login handle
app.post("/loginFacebook", async (req, res) => {
  // console.log(req.body);
  const facebookAuth = req.body.facebook;
  const phoneNumber = req.body.phoneNumber;
  console.log("LOGIN SUCCESSFULL: ", phoneNumber);

  // Connect to firebase
  const usersRef = doc(db, "users", phoneNumber);
  const userSnap = await getDoc(usersRef);
  const facebookData = userSnap.data().facebook;

  // Request page was manage by user
  // const pageResponse = await fetch(
  //   `https://graph.facebook.com/v17.0/me/accounts?access_token=${facebookAuth.accessToken}`
  //   // `https://graph.facebook.com/v17.0/me/accounts?access_token=${facebookAuth.accessToken}`
  // );
  // const pageData = pageResponse.data;

  // console.log(await pageResponse.json());

  try {
    const userRef = await updateDoc(doc(db, "users", phoneNumber), {
      facebook: {
        ...facebookData,
        auth: facebookAuth,
        // page: pageData,
      },
    }).then(() => {
      res.json({ success: true }); // Send the data back to the client
    });
  } catch (e) {
    console.error("Error adding document: ", error);
  }
});

// CREATE facebook post
app.post("/create-facebook-post", async (req, res) => {
  var userAccessToken = "";
  var userID = "";
  try {
    const phoneNumber = req.body.phoneNumber;
    console.log("PHONE: ", phoneNumber);
    // Connect to firebase
    const usersRef = doc(db, "users", phoneNumber);
    const userSnap = await getDoc(usersRef);

    try {
      // GET userAccessToken and userID from database
      userAccessToken = userSnap.data().facebook.auth.accessToken;
      userID = userSnap.data().facebook.auth.userID;
    } catch (err) {
      console.log("Can not get the user auth from firebase: ", err);
    }
  } catch (err) {
    console.log("Can not connect to the firebase: ", err);
  }

  // GET pageAccessToken and page ID
  var pageAccessToken = "";
  var pageID = "";

  try {
    const pageAuthRes = await fetch(
      `https://graph.facebook.com/${userID}/accounts?fields=access_token&access_token=${userAccessToken}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const pageAuthData = await pageAuthRes.json();
    pageAccessToken = pageAuthData.data[0].access_token;
    pageID = pageAuthData.data[0].id;
  } catch (err) {
    console.log("ERROR: Can not get pageAccessToken and page Id: ", err);
  }

  try {
    // Extract the message and image file from the request
    const message = req.body.message;
    const isScheduled = req.body.isScheduled;
    const scheduledPublishTime = req.body.scheduledPublishTime;
    console.log("message: ", message);
    console.log("isScheduled: ", isScheduled);
    console.log("scheduledPublishTime: ", scheduledPublishTime);
    // Create a FormData object to send as a multi-part request
    const formData = new FormData();

    formData.append("message", message);
    formData.append("access_token", pageAccessToken);
    if (isScheduled) {
      formData.append("scheduled_publish_time", scheduledPublishTime);
      formData.append("published", "false");
    }

    // Define the headers manually
    const headers = {
      ...formData.getHeaders(),
    };
    // Make a POST request to upload the image to Facebook
    const uploadResponse = await axios.post(
      `https://graph.facebook.com/v17.0/${pageID}/feed`,
      formData,
      {
        headers: headers,
      }
    );
    // Respond with the Facebook post ID
    res.json({ success: true });
  } catch (error) {
    // Handle errors
    console.log("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false });
  }
});

// CREATE facebook post with photo
app.post(
  "/create-facebook-post-with-photo",
  upload.single("image"),
  async (req, res) => {
    var userAccessToken = "";
    var userID = "";
    try {
      const { phoneNumber } = req.body;
      console.log("PHONE NUMBER: ", phoneNumber);
      // Connect to firebase
      const usersRef = doc(db, "users", phoneNumber);
      const userSnap = await getDoc(usersRef);

      try {
        // GET userAccessToken and userID from database
        userAccessToken = userSnap.data().facebook.auth.accessToken;
        userID = userSnap.data().facebook.auth.userID;
      } catch (err) {
        console.log("Can not get the user auth from firebase: ", err);
      }
    } catch (err) {
      console.log("Can not connect to the firebase: ", err);
    }

    // GET pageAccessToken and page ID
    var pageAccessToken = "";
    var pageID = "";

    try {
      const pageAuthRes = await fetch(
        `https://graph.facebook.com/${userID}/accounts?fields=access_token&access_token=${userAccessToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const pageAuthData = await pageAuthRes.json();
      pageAccessToken = pageAuthData.data[0].access_token;
      pageID = pageAuthData.data[0].id;
    } catch (err) {
      console.log("ERROR: Can not get pageAccessToken and page Id: ", err);
    }

    try {
      // Extract the message and image file from the request
      const { message } = req.body;
      const imageFile = req.file;

      // Create a FormData object to send as a multi-part request
      const formData = new FormData();

      formData.append("message", message);
      formData.append("image", fs.createReadStream(imageFile.path));
      formData.append("access_token", pageAccessToken);

      // Define the headers manually
      const headers = {
        ...formData.getHeaders(),
      };
      // Make a POST request to upload the image to Facebook
      const uploadResponse = await axios.post(
        `https://graph.facebook.com/v17.0/${pageID}/photos`,
        formData,
        {
          headers: headers,
        }
      );
      // Respond with the Facebook post ID
      res.json({ success: true });
    } catch (error) {
      // Handle errors
      console.log(
        "Error:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({ success: false });
    }
  }
);

// Get facebook personal posts
app.post("/get-personal-facebook-posts", async (req, res) => {
  // Receive the phone number from user, get access token from database
  const phoneNumber = req.body.phoneNumber;

  // A function to check wherether the post is user's favorite, if favorite add ? {isFavorite: true} {isFavorite: false}
  function addIsFavoriteProperty(arrayA, arrayB) {
    const idSetB = new Set(arrayB);
    for (const obj of arrayA) {
      if (idSetB.has(obj.id)) {
        obj.isFavorite = true;
      } else {
        obj.isFavorite = false;
      }
    }
  }

  // Connect to firebase
  const usersRef = doc(db, "users", phoneNumber);
  const userSnap = await getDoc(usersRef);
  const access_token = userSnap.data().facebook.auth.accessToken;
  var postData = [];
  var favoritePostData = [];
  var userData = [];

  // GET favorite post id
  try {
    const social = "facebook";
    if (userSnap.exists()) {
      favoritePostData = await userSnap.data()[social].favorite_social_post;
      console.log("FAVORITE POST DATA: ", favoritePostData);
      if (!favoritePostData) favoritePostData = [];
    }
  } catch (error) {
    console.log("Can't get favorite posts from server: ", error);
  }

  // GET facebook posts from facebook server
  try {
    console.log("START GET FACEBOOK POST");
    const response = await fetch(
      `https://graph.facebook.com/v17.0/me?fields=posts{description,caption,full_picture,message,shares,sharedposts},name,id&access_token=${access_token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    // console.log("END GET FACEBOOK POST", data);
    userData = {
      name: data.name,
      id: data.id,
    };
    postData = data.posts.data; // Array[{id, message, full picture, description},...]
  } catch (e) {
    console.error("Error get posts facebook: ", error);
  }

  // ADD isFavorite property to post
  try {
    addIsFavoriteProperty(postData, favoritePostData);
    console.log("COMPLETE ADD isFavorite");
    res.json({ userData: userData, posts: postData }); //Array[{id, message, full picture, description, isFavorite},...]
  } catch (error) {
    console.log("Can' add favorite property: ", error);
  }
});

// Get facebook page posts
app.post("/get-facebook-page-posts", async (req, res) => {
  // Receive the phone number from user, get access token from database
  const phoneNumber = req.body.phoneNumber;
  const usersRef = doc(db, "users", phoneNumber);
  const userSnap = await getDoc(usersRef);

  // Initial variable
  var pagePostData = [];
  var favoritePostData = [];
  var userData = [];
  var userAccessToken = "";
  var userID = "";
  var pageData = { name: "", access_token: "", id: "" };

  // A function to check wherether the post is user's favorite, if favorite add ? {isFavorite: true} {isFavorite: false}
  function addIsFavoriteProperty(arrayA, arrayB) {
    const idSetB = new Set(arrayB);
    for (const obj of arrayA) {
      if (idSetB.has(obj.id)) {
        obj.isFavorite = true;
      } else {
        obj.isFavorite = false;
      }
    }
  }

  // Connect to firebase
  try {
    userAccessToken = userSnap.data().facebook.auth.accessToken;
    userID = userSnap.data().facebook.auth.userID;
  } catch (err) {
    console.error("Fail to connect the database: ", err);
  }

  // GET favorite post id
  try {
    const social = "facebook";
    if (userSnap.exists()) {
      favoritePostData = await userSnap.data()[social].favorite_social_post;
      if (!favoritePostData) favoritePostData = [];
    }
  } catch (error) {
    console.log("Can't get favorite posts from server: ", error);
  }

  // GET page access token
  try {
    const response = await fetch(
      `https://graph.facebook.com/${userID}/accounts?fields=name,access_token&access_token=${userAccessToken}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const res = await response.json();
    pageData = {
      name: res.data[0].name,
      access_token: res.data[0].access_token,
      id: res.data[0].id,
    };
  } catch (e) {
    console.error("Error get page access token: ", error);
  }

  // GET page posts
  try {
    const response = await fetch(
      `https://graph.facebook.com/${pageData.id}/feed?fields=message,created_time,id,permalink_url,full_picture&access_token=${pageData.access_token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //Array[{id, message, full picture, isFavorite, created_time, permalink_url},...]
    const res = await response.json();
    pagePostData = res.data;
  } catch (e) {
    console.log("Error get page post: ", error);
  }

  // ADD isFavorite property to post
  try {
    addIsFavoriteProperty(pagePostData, favoritePostData);
    const postReturn = pagePostData.map((post, index) => ({
      ...post,
      socialID: pageData.id,
      socialName: pageData.name,
      socialPlatform: "facebook",
    }));
    res.json(postReturn); //Array[{id, message, full picture, description, isFavorite},...]
  } catch (error) {
    console.log("Can' add favorite property: ", error);
  }
});

// CREATE the favorite post
app.post("/create-favorite-post", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const postId = req.body.postId;
  const social = req.body.social;
  console.log("PHONE NUMBER: ", phoneNumber);
  console.log("postId: ", postId);
  console.log("social: ", social);
  // Update the favorite post in database
  try {
    const usersRef = doc(db, "users", phoneNumber);
    const docSnap = await getDoc(usersRef);

    const socialData = docSnap.data()[social];
    const favoritePostData = socialData.favorite_social_post;
    console.log("UPDATE NEW FAVORITE POST------");
    if (favoritePostData) {
      updateDoc(usersRef, {
        [social]: {
          ...socialData,
          favorite_social_post: [...favoritePostData, postId],
        },
      });
    } else {
      updateDoc(usersRef, {
        [social]: {
          ...socialData,
          favorite_social_post: [postId],
        },
      });
    }

    res.json({ success: true });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
});

// GET the favorite post
app.get("/get-favorite-posts", async (req, res) => {
  const phoneNumber = "+" + req.query.phoneNumber.trim();
  const social = req.query.social;

  console.log("GET DATA: ", phoneNumber, "social: ", social);
  try {
    // Access Firestore and retrieve the
    const usesRef = doc(db, "users", phoneNumber);
    const useSnap = await getDoc(usesRef);
    console.log();
    if (useSnap.exists()) {
      const facebookData = await useSnap.data()[social].favorite_social_post;
      res.json({ favorite_social_post: facebookData });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("Can't get data information from database");
    }
  } catch (error) {
    console.error("Error retrieving Facebook data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//END Facebook API handle

//START Account api
// GET accounts api
app.post("/get-social-accounts", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  console.log("USER PHONE NUMBER: ", phoneNumber);
  var accountsData = {
    facebook: {
      socialPlatform: "facebook",
      isLogin: false,
      name: "",
      id: "",
      loginExpire: "",
      profileImage: "",
    },
    instagram: {
      socialPlatform: "instagram",
      isLogin: false,
      name: "",
      id: "",
      loginExpire: "",
      profileImage: "",
    },
    twitter: {
      socialPlatform: "twitter",
      isLogin: false,
      name: "",
      id: "",
      loginExpire: "",
      profileImage: "",
    },
  };

  try {
    // Connect to database
    const usersRef = doc(db, "users", phoneNumber);
    const docSnap = await getDoc(usersRef);
    if (docSnap) console.log("---DATA BASE CONNECTED---");
    // Get social account data from firebase
    if (docSnap.exists()) {
      var facebookAccount = docSnap.data().facebook;
      var instagramAccount = docSnap.data().instagram;
      var twitterAccount = docSnap.data().twitter;
      try {
        // Get facebook data from firebase
        const facebookAccountAuth = facebookAccount.auth;
        accountsData = {
          ...accountsData,
          facebook: {
            isLogin: true,
            userName: "",
            id: facebookAccountAuth.userID,
            loginExpire: facebookAccountAuth.data_access_expiration_time,
            profileImage: "",
          },
        };
        console.log(
          "GET FACEBOOK DATA SUCCESSFULLY! ",
          facebookAccountAuth.accessToken
        );
        // Get facebook profile image from facebook api
        try {
          const userPublicInformationRes = await fetch(
            `https://graph.facebook.com/v17.0/me?fields=id%2Cname%2Cpicture&access_token=${facebookAccountAuth.accessToken}`
          );
          const userPublicInformation = await userPublicInformationRes.json();
          accountsData = {
            ...accountsData,
            facebook: {
              socialPlatform: "facebook",
              isLogin: true,
              userName: userPublicInformation.name,
              id: facebookAccountAuth.userID,
              loginExpire: facebookAccountAuth.data_access_expiration_time,
              profileImage: userPublicInformation.picture.data.url,
            },
          };
        } catch (err) {
          console.error("Can not get user profile image: ", err);
        }
      } catch (error) {
        console.error("User does not login to facebook account!");
      }
      try {
        const instagramAccountAuth = instagramAccount.auth;
        accountsData = {
          ...accountsData,
          facebook: {
            isLogin: true,
            userName: "",
            id: instagramAccountAuth.userID,
            loginExpire: instagramAccountAuth.data_access_expiration_time,
            profileImage: "",
          },
        };
      } catch (error) {
        console.error("User does not login to instagram account!");
      }
      try {
        const twitterAccountAuth = twitterAccount.auth;
        accountsData = {
          ...accountsData,
          facebook: {
            isLogin: true,
            userName: "",
            id: twitterAccountAuth.userID,
            loginExpire: twitterAccountAuth.data_access_expiration_time,
            profileImage: "",
          },
        };
      } catch (error) {
        console.error("User does not login to twitter account!");
      }
    } else {
      throw Error("Phon number isn't valid!");
    }

    res.json(Object.values(accountsData));
  } catch (e) {
    console.error("Can't get social account data: ", e);
  }
});
//EDN Account api

// Start the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
