// START initailize
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
} = require("firebase/firestore/lite");
const firebaseConfig = require("./.firebaseConfig/firebaseConfig.json");

module.exports = function () {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Get a list of cities from your database
  async function getCities(db) {
    const citiesCol = collection(db, "user");
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map((doc) => doc.data());
    return cityList;
  }
  getCities(db).then((res) => {
    console.log("res: ", res);
  });
};
