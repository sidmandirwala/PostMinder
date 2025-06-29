import https from "https";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";

import { addToken, getToken } from "./postgres.js";
import { verifyRefreshToken } from "./helpers/jwt_helper.js";
import cloudinary from "./cloudinary.js";

// dotenv.config({ path: "./server/.env" });
dotenv.config();

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Allow self-signed certificates
  }),
});

const fbAppId = process.env.FACEBOOK_APP_ID;
const fbAppSecret = process.env.FACEBOOK_APP_SECRET;

export const longLivedToken = async (req, res) => {
  try {
    const { short_lived_token } = req.body;

    const re = await axios.get(
      `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${fbAppId}&client_secret=${fbAppSecret}&fb_exchange_token=${short_lived_token}`,
      { withCredentials: true }
    );

    const token = re.data.access_token;
    const refreshToken = req.cookies["POSTMINDER_REFRESH_TOKEN"];
    const username = verifyRefreshToken(refreshToken);
    if (username != null) {
      await addToken(username, token);
      return res.status(200);
    } else {
      throw "error";
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getFacebookPages = async (long_lived_token) => {
  const res = await axios.get(
    `https://graph.facebook.com/v17.0/me/accounts?access_token=${long_lived_token}`
  );

  return res.data.data;
};

const getInstagramAccountId = async (facebookPageId, long_lived_token) => {
  const res = await axios.get(
    `https://graph.facebook.com/v17.0/${facebookPageId}?access_token=${long_lived_token}&fields=instagram_business_account`
  );

  return res.data.instagram_business_account.id;
};

const createMediaObjectContainer = async (
  instagramAccountId,
  long_lived_token,
  imageUrl,
  caption
) => {
  const res = await axios.post(
    `https://graph.facebook.com/v17.0/${instagramAccountId}/media`,
    {
      image_url: imageUrl,
      caption: caption,
      access_token: long_lived_token,
    }
  );
  return res.data.id;
};

const publishMediaObjectContainer = async (
  instagramAccountId,
  mediaObjectContainerId,
  long_lived_token
) => {
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v17.0/${instagramAccountId}/media_publish`,
      {
        access_token: long_lived_token,
        creation_id: mediaObjectContainerId,
      }
    );
    res.sendStatus(200);
  } catch (error) {
    console.log("Error");
  }
};

export const schedulePost = async (req, res) => {
  try {
    const { caption, timestamp } = req.body;
    console.table({ caption, timestamp });

    const username = verifyRefreshToken(
      req.cookies["POSTMINDER_REFRESH_TOKEN"]
    );
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath);
    const imageUrl = result.url;

    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    await axiosInstance.post(`${process.env.BULLMQ_URL}/api/schedule`, {
      username: username,
      imageUrl: imageUrl,
      caption: caption,
      timestamp: timestamp,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.send(500).json({ message: "internal server error" });
  }
};

export const shareInstagramPost = async (req, res) => {
  try {
    const { username, imageUrl, caption } = req.body;
    const long_token = await getToken(username);

    const facebookPages = await getFacebookPages(long_token);

    const instagramAccountId = await getInstagramAccountId(
      facebookPages[0].id,
      long_token
    );

    const mediaObjectContainerId = await createMediaObjectContainer(
      instagramAccountId,
      long_token,
      imageUrl,
      caption
    );

    await publishMediaObjectContainer(
      instagramAccountId,
      mediaObjectContainerId,
      long_token
    );
    res.sendStatus(200);
    const regex = /\/([^/]+)\.jpg$/;
    const match = imageUrl.match(regex);

    await cloudinary.uploader.destroy(match[1]);
  } catch (err) {
    console.log("Last Function Error");
    // res.send(500).json({ message: "internal server error" });
  }
};
