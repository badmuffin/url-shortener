const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const URL = require("./models/url");

const app = express();
const PORT = 8000;

// short-url (db name)
connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB Connected")
);

// setting view engine to ejs
app.set("view engine", "ejs");
// for express to know where to look for view files
app.set("views", path.resolve("./views"));

//Returns middleware that only parses json and only looks at requests
//where the Content-Type header matches the type option.
app.use(express.json());
// to support form data
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.use("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        // DB mein push hoga jab bhi user link ko visit karega
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
