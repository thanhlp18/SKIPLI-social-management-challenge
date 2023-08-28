var express = require("express");
const cors = require("cors");
var app = express();

// Enable CORS for all routes
app.use(cors());

app.get("/validate-phone-number", (req, res) => {
  const phoneNumber = req.query.phoneNumber;
  const countryCode = req.query.countryCode;
  console.log("PHONE NUMBER CHECK:", countryCode);
  // Download the helper library from https://www.twilio.com/docs/node/install
  // Find your Account SID and Auth Token at twilio.com/console
  // and set the environment variables. See http://twil.io/secure
  const accountSid = "AC3578061bb4520afcf68810a41fb9bc20";
  const authToken = "b3c8464a5321f7033913dc153d50c367";
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

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
