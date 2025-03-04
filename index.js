require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./db");
const models = require("./models/models");

const cors = require("cors");
const router = require("./routes/index");
const frontpadRouter = require('./routes/frontpadRouter');
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload");
const path = require("path");

const PORT = process.env.PORT;
let corsOptions = {
  origin: ['http://localhost:3000'],
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);
app.use('/api/frontpad', frontpadRouter);
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
