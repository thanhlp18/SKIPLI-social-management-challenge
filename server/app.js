// --------------
// Start express config
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const multer = require("multer");
const upload = multer();
const bodyParser = require("body-parser");
const axios = require("axios");
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
} = require("firebase/firestore/lite");
const firebaseConfig = require("./.firebaseConfig/firebaseConfig.json");
const { defineBoolean } = require("firebase-functions/params");
const { error } = require("firebase-functions/logger");
const firebaseStore = initializeApp(firebaseConfig);
const db = getFirestore(firebaseStore);
// End firebase config

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
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

// Get login data in server
// app.get("/getFacebookLoginData/:userPhoneNumber", async (req, res) => {
//   const userPhoneNumber = req.params.userPhoneNumber;
//   console.log(userPhoneNumber);

//   try {
//     // Access Firestore and retrieve the
//     const usesRef = doc(db, "users", userPhoneNumber);
//     const useSnap = await getDoc(usesRef);
//     console.log(useSnap.data());
//     if (useSnap.exists()) {
//       const facebookData = await useSnap.data().facebook.auth;
//       res.json(facebookData);
//     } else {
//       // docSnap.data() will be undefined in this case
//       console.log("Can't get data information from database");
//     }
//   } catch (error) {
//     console.error("Error retrieving Facebook data:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Get facebook posts
app.post("/get-facebook-posts", async (red, res) => {
  // Receive the phone number from user, get access token from database
  const phoneNumber = red.body.phoneNumber;

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

// CREATE the favorite post
app.post("/create-favorite-post", async (red, res) => {
  const phoneNumber = red.body.phoneNumber;
  const postId = red.body.postId;
  const social = red.body.social;
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

// Start the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
