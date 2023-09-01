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
//Start validate phone number when use input
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
//End validate phone number when use input

//START OTP HANDLE
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
    const userRef = await setDoc(doc(db, "users", phoneNumber), {
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

// // START facebook login handle

app.post("/loginFacebook", async (req, res) => {
  console.log(req.body);
  const accessToken = req.body.accessToken;
  const phoneNumber = req.body.phoneNumber;
  const provider = req.body.provider;
  const timeStamp = serverTimestamp();

  const social = {
    [provider]: {
      accessToken: accessToken,
      expirationTime: timeStamp,
    },
  };

  // addDoc(collection(db, "users")
  try {
    const userRef = await updateDoc(doc(db, "users", phoneNumber), {
      [provider]: {
        accessToken: accessToken,
        expirationTime: timeStamp,
      },
    }).then(() => {
      res.json({ success: true }); // Send the data back to the client
    });
  } catch (e) {
    console.error("Error adding document: ");
  }
});
// // Facebook App credentials
// const facebookAppId = process.env.FACEBOOK_APP_API;
// const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
// const redirectUri = process.env.REDIRECT_URL;

// app.get("/login-facebook", async (req, res) => {
//   const code = req.query.code;

//   // Send the validate code to client
//   // res.send(code);
//   axios
//     .get("https://graph.facebook.com/v17.0/oauth/access_token", {
//       params: {
//         client_id: facebookAppId,
//         redirect_uri: redirectUri,
//         client_secret: facebookAppSecret,
//         code: code,
//       },
//     })
//     .then((response) => {
//       const responseData = response.data;

//       if (responseData.error) {
//         // Handle Facebook API error
//         console.error("Facebook API error:", responseData.error);
//         res.status(500).json({ error: "Facebook API error" });
//       } else if (responseData.access_token) {
//         // Access token successfully received
//         console.log("Access Token:", responseData.access_token);
//         res.json({ success: true, access_token: responseData.access_token });
//       } else {
//         // Handle unexpected response
//         console.error("Unexpected response from Facebook");
//         res.status(500).json({ error: "Unexpected response from Facebook" });
//       }
//     })
//     .catch((error) => {
//       console.error("Facebook login error:", error);
//       res.status(500).json({ error: "Failed to log in with Facebook" });
//     });
// });
// //END facebook login handle

// Start the server
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
