const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8000;

// short-url (db name)
connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB Connected")
);

//Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());

app.use("/url", urlRoute);

app.use("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: { // DB mein push hoga jab bhi user link ko visit karega
        visitHistory: {
            timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
