// config/config.js
import dotenv from "dotenv";
dotenv.config({
    override:false,
    debug:true
})
export default {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  refreshSecret:process.env.REFRESH_SECRET,
  imagekitEndpoint:process.env.IMAGEKIT_URL_ENDPOINT,
  imagekitPublicKey:process.env.IMAGEKIT_PUBLIC_KEY,
  imagekitPrivateKey:process.env.IMAGEKIT_PRIVET_KEY,
  port: process.env.PORT || 9000,
  mailUser:process.env.EMAIL_USER,
  mailPass:process.env.EMAIL_PASS,
};
// console.log(process.env.MONGO_URI);
