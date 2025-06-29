import multer, { diskStorage } from "multer";
import { verifyRefreshToken } from "./helpers/jwt_helper.js";

// Set up storage for uploaded files
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const refreshToken = req.cookies["POSTMINDER_REFRESH_TOKEN"];
    const username = verifyRefreshToken(refreshToken);
    cb(null, username + file.originalname);
  },
});

// Create the multer instance
export const upload = multer({ storage: storage });
