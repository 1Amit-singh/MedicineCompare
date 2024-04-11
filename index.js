const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(cors());

let medicineList = [];

app.post("/medicine", (req, res) => {
  const medicine = req.body.medicine;
  // console.log(req);
  const medicineName = medicine.split(" ").join("+") + "+tablet";
  const API = `${process.env.API_ENDPOINT}${medicineName}`;

  fetch(API)
    .then((data) => data.json())
    .then((data) => {
      const medicineData = data.pageProps.serverData.medData.result;
      //   res.send(medicineData);
      medicineData.map((item) => {
        medicineList.push({
          medicine_name: item._source.Medicine_Name,
          medicine_link: item._source.Medicine_Link,
          retail_price: item._source.Retail_Price,
          discounted_price: item._source.Discounted_Price,
          image:
            item._source.Images[0] ||
            "https://www.kauverymeds.com/uploads/product/main/thumb.png",
          company: item._source.Source,
        });
      });
      res.render(`${__dirname}/views/compare.ejs`, {
        medicineList: medicineList,
      });
      medicineList = [];
      // console.log(medicineList);
      // res.send(medicineList);
    })
    .catch((err) => console.log(err));
});

app.get("/", (req, res) => {
  res.render(`${__dirname}/views/index.ejs`);
});

app.listen(3000, () => {
  console.log("Port 3000 is running...");
});
