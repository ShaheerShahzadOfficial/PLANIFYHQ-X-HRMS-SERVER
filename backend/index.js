import app from "./app.js";
import http from "http";
import DBConnection from "./config/dbconfig.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config();

DBConnection();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
