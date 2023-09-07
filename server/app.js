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
const schedule = require("node-schedule");

// Start firebase config
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  setDoc,
  getDoc,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} = require("firebase/firestore");
const firebaseConfig = require("./.firebaseConfig/firebaseConfig.json");
const { defineBoolean } = require("firebase-functions/params");
const { error } = require("firebase-functions/logger");
const cron = require("node-cron");
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
        // Get server time to check is account token expired
        const serverTime = Timestamp.fromDate(new Date()).seconds;

        const accountExpireTime =
          facebookAccountAuth.data_access_expiration_time;

        // Check expired login time of use
        if (serverTime < accountExpireTime) {
          accountsData = {
            ...accountsData,
            facebook: {
              ...accountsData.facebook,
              isLogin: true,
              userName: "",
              id: facebookAccountAuth.userID,
              loginExpire: facebookAccountAuth.data_access_expiration_time,
              profileImage: "",
            },
          };
        }

        // Get facebook profile image from facebook api

        try {
          const userPublicInformationRes = await fetch(
            `https://graph.facebook.com/v17.0/me?fields=id,name,picture&access_token=${facebookAccountAuth.accessToken}`
          );

          const userPublicInformation = await userPublicInformationRes.json();
          accountsData = {
            ...accountsData,
            facebook: {
              ...accountsData.facebook,
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
        // Get server time to check is account token expired
        const serverTime = Timestamp.fromDate(new Date()).seconds;
        const accountExpireTime =
          instagramAccountAuth.data_access_expiration_time;

        // Check expired login time of use
        if (serverTime < accountExpireTime) {
          accountsData = {
            ...accountsData,
            instagram: {
              ...accountsData.instagram,
              isLogin: true,
              userName: "",
              id: instagramAccountAuth.userID,
              loginExpire: instagramAccountAuth.data_access_expiration_time,
              profileImage: "",
            },
          };
        }
      } catch (error) {
        console.error("User does not login to instagram account!");
      }
      try {
        const twitterAccountAuth = twitterAccount.auth;
        // Get server time to check is account token expired
        const serverTime = Timestamp.fromDate(new Date()).seconds;
        const accountExpireTime =
          twitterAccountAuth.data_access_expiration_time;

        // Check expired login time of use
        if (serverTime < accountExpireTime) {
          accountsData = {
            ...accountsData,
            twitter: {
              ...accountsData.twitter,
              isLogin: true,
              userName: "",
              id: twitterAccountAuth.userID,
              loginExpire: twitterAccountAuth.data_access_expiration_time,
              profileImage: "",
            },
          };
        }
      } catch (error) {
        console.error("User does not login to twitter account!");
      }
    } else {
      throw Error("Phon number isn't valid!");
    }
    res.json(accountsData);
  } catch (e) {
    console.error("Can't get social account data: ", e);
  }
});

app.post("/get-social-accounts-login-status", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
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
    var loginStatus = {
      facebook: {
        socialPlatform: "facebook",
        isLogin: false,
        message: "User does not login to facebook account!",
      },
      instagram: {
        socialPlatform: "instagram",
        isLogin: false,
        message: "User does not login to instagram account!",
      },
      twitter: {
        socialPlatform: "twitter",
        isLogin: false,
        message: "User does not login to twitter account!",
      },
    };
    // Get social account data from firebase
    if (docSnap.exists()) {
      var facebookAccount = docSnap.data().facebook;
      var instagramAccount = docSnap.data().instagram;
      var twitterAccount = docSnap.data().twitter;

      // CHECK FACEBOOK ACCOUNT
      try {
        // Get facebook data from firebase
        const facebookAccountAuth = facebookAccount.auth;

        // Get server time to check is account token expired
        const serverTime = Timestamp.fromDate(new Date()).seconds;
        const accountExpireTime =
          facebookAccountAuth.data_access_expiration_time;

        // Check expired login time of use
        if (serverTime < accountExpireTime) {
          loginStatus = {
            ...loginStatus,
            facebook: {
              socialPlatform: "facebook",
              isLogin: true,
              message: "",
            },
          };
        } else {
          loginStatus = {
            ...loginStatus,
            facebook: {
              socialPlatform: "facebook",
              isLogin: false,
              message: "User login session is expired",
            },
          };
        }
      } catch (error) {
        console.error("User does not login to facebook account!");
      }

      // CHECK instagram ACCOUNT
      try {
        // Get instagram data from firebase
        const instagramAccountAuth = instagramAccount.auth;

        // Get server time to check is account token expired
        const serverTime = Timestamp.fromDate(new Date()).seconds;
        const accountExpireTime =
          instagramAccountAuth.data_access_expiration_time;

        // Check expired login time of use
        if (serverTime < accountExpireTime) {
          loginStatus = {
            ...loginStatus,
            instagram: {
              socialPlatform: "instagram",
              isLogin: true,
              message: "",
            },
          };
        } else {
          loginStatus = {
            ...loginStatus,
            instagram: {
              socialPlatform: "instagram",
              isLogin: false,
              message: "User login session is expired",
            },
          };
        }
      } catch (error) {
        console.error("User does not login to instagram account!");
      }
    } else {
      throw Error("Phon number isn't valid!");
    }

    res.json(Object.values(loginStatus));
  } catch (e) {
    console.error("Can't get social account data: ", e);
  }
});

//EDN Account api

// -----------------------------------------------
//START FACEBOOK API HANDLE
// Facebook login handle
app.post("/login-meta", async (req, res) => {
  const metaAuth = req.body.meta;
  const socialPlatform = req.body.socialPlatform;
  const phoneNumber = req.body.phoneNumber;
  console.log("socialPlatform: ", socialPlatform);

  // CONNECT TO FIREBASE
  const usersRef = doc(db, "users", phoneNumber);
  const userSnap = await getDoc(usersRef);

  console.log(userSnap.data()[socialPlatform]);
  // CHECK THE SOCIAL PLATFORM USER LOGIN
  if (socialPlatform === "facebook") {
    console.log("LOGGING TO FACEBOOK ACCOUNT");

    try {
      const userRef = await updateDoc(doc(db, "users", phoneNumber), {
        [socialPlatform]: {
          ...userSnap.data()[socialPlatform],
          auth: metaAuth,
        },
      });

      res.json({ success: true });
    } catch (e) {
      console.error("Can not login to facebook: ", error);
    }
  }
  if (socialPlatform === "instagram") {
    console.log("LOGGING TO INSTAGRAM ACCOUNT");
    // If the platform is instagram, get the instagram
    try {
      // GET userAccessToken and userID from database
      userAccessToken = metaAuth.accessToken;
      userID = metaAuth.userID;
      // Get the User's Pages
      const userPageResponse = await fetch(
        `https://graph.facebook.com/v17.0/${userID}/accounts?access_token=${userAccessToken}`
      );

      const userPageData = await userPageResponse.json();

      // NEED TO IMPROVE IN THE FUTURE **********************************
      // Get the Page's Instagram Business Account with the use page id
      const userPageId = userPageData.data[0].id;
      const instagramBAResponse = await fetch(
        `https://graph.facebook.com/v17.0/${userPageId}?fields=instagram_business_account&access_token=${userAccessToken}`
      );
      const instagramBAData = await instagramBAResponse.json();
      const instagramBAID = instagramBAData.instagram_business_account.id;

      // Save the instagram business account to firebase
      // console.log(
      //   "userSnap.data()[socialPlatform] ",
      //   userSnap.data()[socialPlatform].auth
      // );
      const userRef = await updateDoc(doc(db, "users", phoneNumber), {
        [socialPlatform]: {
          ...userSnap.data()[socialPlatform],
          auth: {
            ...metaAuth,
            instagram_business_account_id: instagramBAID,
          },
          // page: pageData,
        },
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Can not find instagram id: ", err);
    }
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

    // GET USER INFORMATION FROM DATABASE
    try {
      const { phoneNumber } = req.body;
      console.log("CREATE A POST WITH PHOTO ", phoneNumber);
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

    // GET pageAccessToken AND pageID
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

    // POST TO FACEBOOK
    try {
      // Extract the message and image file from the request
      const message = req.body.message;
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
      // Respond with the {status: true}
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
  var postData = []; //[{caption: ' ', createTime: '', id: ''.,isFavorite:'',mediaUrl:'', permalink: '', socialPlatform: ''}  ..]
  var favoritePostData = {}; //[facebook: [id1, id2, id3], instagram: [id1, id2, id3], ...]
  var userData = [];

  // A function to check whether the post is user's favorite, if favorite add ? {isFavorite: true} {isFavorite: false}
  function addIsFavoriteProperty(arrayA, arrayB) {
    const idSetB = new Set(arrayB);
    for (const obj of arrayA) {
      if (idSetB.has(`${obj.socialPlatform}_${obj.id}`)) {
        obj.isFavorite = true;
      } else {
        obj.isFavorite = false;
      }
    }
  }

  // 2. GET FAVORITE POST ID //{socialPlatform_id1, socialPlatform_id1,...}
  try {
    if (userSnap.exists()) {
      if (userSnap.data().favorite_social_post) {
        favoritePostData = userSnap.data().favorite_social_post;
      }
    }
  } catch (error) {
    console.log("Can't get favorite posts from server: ", error);
  }
  // console.log("favoritePostData: ", favoritePostData);

  // 3. GET POST DATA
  if (userSnap.exists()) {
    var facebookAccount = userSnap.data().facebook;
    var instagramAccount = userSnap.data().instagram;
    var twitterAccount = userSnap.data().twitter;
    //GET FACEBOOK POST DATA
    try {
      var facebookPostData = [];

      // 3.1 Get facebook auth data from firebase
      const facebookAccountAuth = facebookAccount.auth;
      const accountExpireTime = facebookAccountAuth.data_access_expiration_time;
      // 3.2 Get server time to check is account token expired
      const serverTime = Timestamp.fromDate(new Date()).seconds;

      // 3.3 Check expired login time of use and start to get facebook post
      if (serverTime < accountExpireTime) {
        //a. GET page data
        let pageData = {
          socialPlatform: "facebook",
          socialName: "",
          access_token: "",
          socialID: "", //socailID: pageID
          page_profile_picture_url: "",
        };
        try {
          const response = await fetch(
            `https://graph.facebook.com/${facebookAccountAuth.userID}/accounts?fields=name,access_token,picture{url}&access_token=${facebookAccountAuth.accessToken}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const res = await response.json();
          pageData = {
            socialPlatform: "facebook",
            socialName: res.data[0].name,
            access_token: res.data[0].access_token,
            socialID: res.data[0].id,
            page_profile_picture_url: res.data[0].picture.data.url,
          };
        } catch (e) {
          console.error("Error get page access token: ", error);
        }

        //b. GET page post
        try {
          const response = await fetch(
            `https://graph.facebook.com/${pageData.socialID}/feed?fields=message,created_time,id,permalink_url,full_picture&access_token=${pageData.access_token}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const res = await response.json();

          //Array[{id, message, full picture, isFavorite, created_time, permalink_url},...]
          //-----> Expect: Array[{socialPlatform, socialID ,id ,socialName ,page_profile_img_url ,caption, media_url, isFavorite, timestamp, permalink},...]
          res.data.map((ele, index) => {
            facebookPostData.push({
              socialPlatform: pageData.socialPlatform,
              socialID: pageData.socialID,
              socialName: pageData.socialName,
              pageProfilePictureUrl: pageData.page_profile_picture_url,
              id: ele.id,
              caption: ele.message ? ele.message : "",
              mediaUrl: ele.full_picture ? ele.full_picture : "",
              createTime: ele.created_time ? ele.created_time : "",
              permalink: ele.permalink_url ? ele.permalink_url : "",
              isFavorite: "false",
            });
          });
        } catch (e) {
          console.log("Can't get facebook posts: ", error);
        }

        //c. Check favorite with platform post id
        addIsFavoriteProperty(facebookPostData, favoritePostData);
        postData.push(...facebookPostData);
      } else {
        console.log("Facebook login session is expired!");
      }
    } catch (error) {
      console.error("User does not login to facebook account!");
    }

    //GET INSTAGRAM POST DATA
    try {
      // 3.1 Get facebook auth data from firebase
      const instagramAccountAuth = instagramAccount.auth;
      const accountExpireTime =
        instagramAccountAuth.data_access_expiration_time;

      // 3.2 Get server time to check is account token expired
      const serverTime = Timestamp.fromDate(new Date()).seconds;

      // 3.3 Check expired login time of use and start to get facebook post
      if (serverTime < accountExpireTime) {
        //a. GET page data

        // Connect to firebase
        var pageData = {
          socialPlatform: "instagram",
          socialName: "",
          access_token: "",
          socialID: "", //socialID: instagramBusinessAccountId
          page_profile_picture_url: "",
        };
        var instagramPostData = [];
        try {
          const access_token = userSnap.data().instagram.auth.accessToken;
          const socialID =
            userSnap.data().instagram.auth.instagram_business_account_id; //instagram_Business_Account_Id

          try {
            const instagramProfileRes = await fetch(
              `https://graph.facebook.com/v17.0/${socialID}?fields=profile_picture_url,username&access_token=${access_token}`
            );
            const instagramProfile = await instagramProfileRes.json();
            pageData = {
              ...pageData,
              socialName: instagramProfile.username,
              access_token: access_token,
              socialID: socialID, //socailID: pageID
              page_profile_picture_url: instagramProfile.profile_picture_url,
            };
          } catch (err) {
            console.log(
              "Can't get instagram user name and profile picture url: ",
              err
            );
          }
        } catch (err) {
          console.error(
            "Fail to connect the database and get instagram data from database: ",
            err
          );
        }

        //b. GET page post
        try {
          const instagramPostsRes = await fetch(
            `https://graph.facebook.com/v17.0/${pageData.socialID}/media?fields=caption,id,timestamp,media_url,permalink&access_token=${pageData.access_token}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          //Array[{id, caption, media_url, isFavorite, timestamp, permalink_url},...]
          //Array[{caption: ' ', created_time: '', id: ''.,isFavorite:'',mediaUrl:'', permalink: '', socialPlatform: '', socialID: '',socialName: "", }  ..]
          const instagramPosts = await instagramPostsRes.json();
          let instagramPostDataTemp = instagramPosts.data;
          instagramPostDataTemp.map((post, idx) => {
            instagramPostData.push({
              socialPlatform: "instagram",
              socialID: pageData.socialID,
              socialName: pageData.socialName,
              pageProfilePictureUrl: pageData.page_profile_picture_url,
              caption: post.caption || "",
              createTime: post.timestamp,
              id: post.id,
              isFavorite: "false",
              mediaUrl: post.media_url,
              permalink: post.permalink,
            });
          });
        } catch (e) {
          console.log("Error get  instagram posts: ", error);
        }

        //c. Check favorite with platform post id
        addIsFavoriteProperty(instagramPostData, favoritePostData);
        console.log(instagramPostData);
        postData.push(...instagramPostData);
      } else {
        console.log("Facebook login session is expired!");
      }
    } catch (error) {
      console.error("User does not login to facebook account!");
    }
    // console.log("instagramPostDataTemp: ", postData);
    // try {
    //   const instagramAccountAuth = instagramAccount.auth;
    //   // Get server time to check is account token expired
    //   const serverTime = Timestamp.fromDate(new Date()).seconds;
    //   const accountExpireTime =
    //     instagramAccountAuth.data_access_expiration_time;

    //   // Check expired login time of use
    //   if (serverTime < accountExpireTime) {
    //     accountsData = {
    //       ...accountsData,
    //       instagram: {
    //         ...accountsData.instagram,
    //         isLogin: true,
    //         userName: "",
    //         id: instagramAccountAuth.userID,
    //         loginExpire: instagramAccountAuth.data_access_expiration_time,
    //         profileImage: "",
    //       },
    //     };
    //   }
    // } catch (error) {
    //   console.error("User does not login to instagram account!");
    // }
    // try {
    //   const twitterAccountAuth = twitterAccount.auth;
    //   // Get server time to check is account token expired
    //   const serverTime = Timestamp.fromDate(new Date()).seconds;
    //   const accountExpireTime = twitterAccountAuth.data_access_expiration_time;

    //   // Check expired login time of use
    //   if (serverTime < accountExpireTime) {
    //     accountsData = {
    //       ...accountsData,
    //       twitter: {
    //         ...accountsData.twitter,
    //         isLogin: true,
    //         userName: "",
    //         id: twitterAccountAuth.userID,
    //         loginExpire: twitterAccountAuth.data_access_expiration_time,
    //         profileImage: "",
    //       },
    //     };
    //   }
    // } catch (error) {
    //   console.error("User does not login to twitter account!");
    // }

    //[{caption: ' ', created_time: '', id: ''.,isFavorite:'',media_url:'', permalink: '', socialPlatform: ''}  ..]
    res.json(postData);
  } else {
    console.log("Phon number isn't valid!");
  }

  // 5. ADD isFavorite property to post
  // try {
  //   addIsFavoriteProperty(pagePostData, favoritePostData);
  //   const postReturn = pagePostData.map((post, index) => ({
  //     ...post,
  //     socialID: pageData.id,
  //     socialName: pageData.name,
  //     socialPlatform: "facebook",
  //   }));
  //   res.json(postReturn); //Array[{id, message, full picture, description, isFavorite},...]
  // } catch (error) {
  //   console.log("Can' add favorite property: ", error);
  // }
});

// CREATE the favorite post
app.post("/create-favorite-post", async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  const postId = req.body.postId;
  const socialPlatform = req.body.socialPlatform;
  const isSateFavorite = req.body.isSateFavorite;

  console.log("PHONE NUMBER: ", phoneNumber);
  console.log("postId: ", postId);
  console.log("social: ", socialPlatform);
  // Update the favorite post in database
  try {
    // Connect to database
    const usersRef = doc(db, "users", phoneNumber);
    const docSnap = await getDoc(usersRef);

    const favoritePostData = docSnap.data().favorite_social_post;

    try {
      if (favoritePostData) {
        // isSateFavorite = true, meaning user want to delete the favorite status
        if (isSateFavorite) {
          try {
            const newFavoriteSocialPost = favoritePostData.filter(
              (item) => item !== `${socialPlatform}_${postId}`
            );
            updateDoc(usersRef, {
              favorite_social_post: newFavoriteSocialPost,
            });
            console.log("REMOVE THE FAVORITE POST: ", postId);
          } catch (err) {
            console.log("Can't remove the favorite post: ", err);
          }
        } else {
          try {
            updateDoc(usersRef, {
              favorite_social_post: [
                ...favoritePostData,
                `${socialPlatform}_${postId}`,
              ],
            });
          } catch (err) {
            console.log("Can't add favorite post: ", err);
          }
        }
      } else {
        updateDoc(usersRef, {
          favorite_social_post: [`${socialPlatform}_${postId}`],
        });
      }
    } catch (err) {
      console.log("Can't update the favorite post!: ", err);
    }
    res.json({ success: true });
  } catch (e) {
    console.error("Can't connect to database: ", e);
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

//END FACEBOOK API HANDLE
// -----------------------------------------------

// -----------------------------------------------
// START INSTAGRAM API HANDLE
// 1. CREATE an instagram post
app.post(
  "/create-an-instagram-post",
  upload.single("image"),
  async (req, res) => {
    // Extract the message and image file from the request
    const message = req.body.message;
    const imageFile = req.file;
    // Send the error back to client if user don't upload image
    if (!imageFile) {
      res.json({
        success: false,
        message: "INSTAGRAM REQUIRE AT LEAST ONE IMAGE PER POST",
      });
    }

    var userAccessToken = "";
    var userID = "";
    var instagramBusinessAccountId = "";
    //  a. GET userAccessToken, userID, instagramBusinessAccountId from database
    try {
      const { phoneNumber } = req.body;
      console.log("PHONE NUMBER: ", phoneNumber);
      // Connect to firebase
      const usersRef = doc(db, "users", phoneNumber);
      const userSnap = await getDoc(usersRef);

      try {
        // GET userAccessToken and userID from database
        userAccessToken = userSnap.data().instagram.auth.accessToken;
        userID = userSnap.data().instagram.auth.userID;
        instagramBusinessAccountId =
          userSnap.data().instagram.auth.instagram_business_account_id;
      } catch (err) {
        console.log("Can not get the user auth from firebase: ", err);
      }
    } catch (err) {
      console.log("Can not connect to the firebase: ", err);
    }

    var pageAccessToken = "";
    var facebookPageID = "";
    var imageUrl = "";
    // b. GET pageAccessToken and pageID
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
      facebookPageID = pageAuthData.data[0].id;
    } catch (err) {
      console.log("CAN'T GET pageAccessToken AND pageId: ", err);
    }

    // c. Post to facebook with unpublish type, get the post id return. Then get the image_url by id
    try {
      // Create a FormData object to send as a multi-part request
      const formData = new FormData();
      formData.append("message", message);
      formData.append("image", fs.createReadStream(imageFile.path));
      formData.append("access_token", pageAccessToken);
      formData.append("published", "false");

      // Define the headers manually
      const headers = {
        ...formData.getHeaders(),
      };
      // Make a POST request to upload the image to Facebook
      const uploadResponse = await axios.post(
        `https://graph.facebook.com/v17.0/${facebookPageID}/photos`,
        formData,
        {
          headers: headers,
        }
      );
      // Respond with the Facebook post ID
      const photoId = uploadResponse.data.id;
      console.log("photoId", photoId);

      // Get photo url with id return

      const arrayPhotoUrlResponse = await fetch(
        `https://graph.facebook.com/v17.0/${photoId}?fields=images&access_token=${userAccessToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const arrayPhotoUrl = await arrayPhotoUrlResponse.json();
      imageUrl = arrayPhotoUrl.images[0].source;
      // res.json(arrayPhotoUrlResponse);
    } catch (error) {
      console.log(
        "CAN'T POST TO FACEBOOK WITH UNPUBLISH STATUS:",
        error.response ? error.response.data : error.message
      );
    }

    // c. Create a container (creation id) with image
    var containerId = "";
    try {
      const containerIDResponse = await fetch(
        `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media?access_token=${userAccessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_url: imageUrl, caption: message }),
        }
      );

      const containerData = await containerIDResponse.json();
      containerId = containerData.id;
    } catch (err) {
      console.error("Can not create a container for this image: ", err);
    }

    // d. Publish to instagram
    try {
      const instagramPostStatusResponse = await fetch(
        `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media_publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            creation_id: containerId,
            access_token: userAccessToken,
          }),
        }
      );
      const instagramPostStatus = await instagramPostStatusResponse.json();
      res.json(instagramPostStatus);
    } catch (err) {
      console.error("Can not push to instagram: ", err);
    }
  }
);

// 2. CREATE a schedule instagram post
app.post(
  "/create-a-schedule-instagram-post",
  upload.single("image"),
  async (req, res) => {
    // a. Get data from request
    const scheduleDate = req.body.scheduleDate;
    const targetDate = new Date(
      "Wed Sep 06 2023 15:20:47 GMT+0700 (Indochina Time)"
    );
    const message = req.body.message;
    const phoneNumber = req.body.phoneNumber;
    const imageFile = req.file;
    console.log("THE POST WAS RESCHEDULE AT: ", targetDate);

    // b. Process to make an instagram post
    const createAnInstagramPost = async () => {
      var userAccessToken = "";
      var userID = "";
      var instagramBusinessAccountId = "";
      try {
        // Connect to firebase
        const usersRef = doc(db, "users", phoneNumber);
        const userSnap = await getDoc(usersRef);

        try {
          // GET userAccessToken and userID from database
          userAccessToken = userSnap.data().instagram.auth.accessToken;
          userID = userSnap.data().instagram.auth.userID;
          instagramBusinessAccountId =
            userSnap.data().instagram.auth.instagram_business_account_id;
        } catch (err) {
          console.log("Can not get the user auth from firebase: ", err);
        }
      } catch (err) {
        console.log("Can not connect to the firebase: ", err);
      }

      // GET pageAccessToken and page ID
      var pageAccessToken = "";
      var facebookPageID = "";
      var imageUrl = "";
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
        facebookPageID = pageAuthData.data[0].id;
      } catch (err) {
        console.log("ERROR: Can not get pageAccessToken and page Id: ", err);
      }

      // -----
      //1. Post to facebook with unpublish type, get the post id return. Then get the image_url by id
      try {
        // Extract the message and image file from the request

        // Create a FormData object to send as a multi-part request
        const formData = new FormData();

        formData.append("message", message);
        formData.append("image", fs.createReadStream(imageFile.path));
        formData.append("access_token", pageAccessToken);
        formData.append("published", "false");

        // Define the headers manually
        const headers = {
          ...formData.getHeaders(),
        };
        //1. Make a POST request to upload the image to Facebook
        const uploadResponse = await axios.post(
          `https://graph.facebook.com/v17.0/${facebookPageID}/photos`,
          formData,
          {
            headers: headers,
          }
        );
        // Respond with the Facebook post ID
        const photoId = uploadResponse.data.id;
        console.log("photoId", photoId);

        //2. Get photo url with id return
        const arrayPhotoUrlResponse = await fetch(
          `https://graph.facebook.com/v17.0/${photoId}?fields=images&access_token=${userAccessToken}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const arrayPhotoUrl = await arrayPhotoUrlResponse.json();
        imageUrl = arrayPhotoUrl.images[0].source;
        // res.json(arrayPhotoUrlResponse);
      } catch (error) {
        // Handle errors
        console.log(
          "Error:",
          error.response ? error.response.data : error.message
        );
      }

      //2. Create a container with image
      var containerId = "";
      try {
        const containerIDResponse = await fetch(
          `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media?access_token=${userAccessToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image_url: imageUrl, caption: message }),
          }
        );

        const containerData = await containerIDResponse.json();
        containerId = containerData.id;
      } catch (err) {
        console.error("Can not create a container for this image: ", err);
      }

      //3. Publish to instagram
      try {
        const instagramPostStatusResponse = await fetch(
          `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media_publish`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              creation_id: containerId,
              access_token: userAccessToken,
            }),
          }
        );
        const instagramPostStatus = await instagramPostStatusResponse.json();
        res.json(instagramPostStatus);
      } catch (err) {
        console.error("Can not push to instagram: ", err);
      }
    };

    res.json({
      success: true,
      message: `Your post was schedule at ${targetDate}`,
    });

    //c.  Schedule the instagram post process in our server with process and schedule date
    try {
      const targetDate = new Date(scheduleDate);
      const job = schedule.scheduleJob(targetDate, () => {
        console.log(`Scheduled API call at ${targetDate}`);
        createAnInstagramPost();
      });
    } catch (err) {
      console.error("Can not schedule a post: ", err);
    }
  }
);

// 3. GET instagram page posts
app.post("/get-instagram-page-posts", async (req, res) => {
  // Receive the phone number from user, get access token from database
  const phoneNumber = req.body.phoneNumber;
  const usersRef = doc(db, "users", phoneNumber);
  const userSnap = await getDoc(usersRef);

  // Initial variable
  const social = "instagram";
  var instagramPostData = [];
  var favoritePostData = [];
  var userData = [];
  var userAccessToken = "";
  var instagramBusinessAccountId = "";
  var instagramData = { name: "", access_token: "", id: "" };

  // A function to check wherether the post is user's favorite, if favorite add ? {isFavorite: true} {isFavorite: false}
  function addIsFavoriteProperty(arrayA, arrayB) {
    console.log("OKKKKKKKKK", arrayA);
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
    userAccessToken = userSnap.data()[social].auth.accessToken;
    instagramBusinessAccountId =
      userSnap.data()[social].auth.instagram_business_account_id;
  } catch (err) {
    console.error("Fail to connect the database: ", err);
  }

  // GET favorite post id
  try {
    if (userSnap.exists()) {
      favoritePostData = await userSnap.data()[social].favorite_social_post;
      if (!favoritePostData) favoritePostData = [];
    }
  } catch (error) {
    console.log("Can't get favorite posts from server: ", error);
  }

  // GET instagram posts

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${instagramBusinessAccountId}/media?fields=caption,id,timestamp,media_url,permalink&access_token=${userAccessToken}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    //Array[{id, message, full picture, isFavorite, created_time, permalink_url},...]
    //Array[{id, caption, media_url, isFavorite, timestamp, permalink},...]
    const res = await response.json();
    instagramPostData = res.data;
  } catch (e) {
    console.log("Error get  instagram posts: ", error);
  }

  // ADD isFavorite property to post
  try {
    const posts = instagramPostData.map((post, index) => ({
      ...posts,
      socialID: post.id,
      socialName: post.name,
      socialPlatform: "instagram",
    }));
    console.log(poss);
    addIsFavoriteProperty(post, favoritePostData);

    //Array[{id, message, full picture, description, isFavorite},...]
    //-----> Expect: Array[{id, caption, media_url, isFavorite, timestamp, permalink},...]
    const resultPost = [];
    console.log(instagramPostData);
    posts.map((post, index) => {
      resultPost.push({
        id: post.id ? post.id : "",
        caption: post.caption ? post.caption : "",
        media_url: post.media_url ? post.media_url : "",
        timestamp: post.timestamp ? post.timestamp : "",
        permalink: post.permalink ? post.permalink : "",
        isFavorite: "false",
      });
    });
    console.log("resultPost", resultPost);
    res.json(resultPost);
  } catch (error) {
    console.log("Can' add favorite property: ", error);
  }
});

// END INSTAGRAM API HANDLE
// -----------------------------------------------

// Start the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
