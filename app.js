require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

//extra security  packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const expressLimiter = require("express-rate-limit");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages
app.set("trust proxy", 1);
app.use(
  expressLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send('<h1>Jobs api</h1> <a href= "/api-docs">Documentation</a>');
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", authenticateUser, jobRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
