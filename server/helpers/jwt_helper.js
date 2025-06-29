import dotenv from "dotenv";
import jwt from "jsonwebtoken";

// dotenv.config({ path: "./server/.env" });
dotenv.config();

export function signAccessToken(payload) {
  const accessToken = jwt.sign(
    payload,
    process.env.POSTMINDER_ACCESS_TOKEN_SECRET,
    { expiresIn: "10m", issuer: "PostMinder" }
  );
  return accessToken;
}

export function verifyAccessToken(accessToken) {
  try {
    const payload = jwt.verify(
      accessToken,
      process.env.POSTMINDER_ACCESS_TOKEN_SECRET
    );
    return payload.username;
  } catch (error) {
    return null;
  }
}

export function signRefreshToken(payload) {
  const refreshToken = jwt.sign(
    payload,
    process.env.POSTMINDER_REFRESH_TOKEN_SECRET,
    { expiresIn: "1d", issuer: "PostMinder" }
  );
  return refreshToken;
}

export function verifyRefreshToken(refreshToken) {
  try {
    if (refreshToken == null) return null;
    const payload = jwt.verify(
      refreshToken,
      process.env.POSTMINDER_REFRESH_TOKEN_SECRET
    );
    return payload.username;
  } catch (error) {
    return null;
  }
}

export async function validateRefreshAndAccessToken(req, res) {
  try {
    const accessToken = req.cookies["POSTMINDER_ACCESS_TOKEN"];
    const refreshToken = req.cookies["POSTMINDER_REFRESH_TOKEN"];
    const access = verifyAccessToken(accessToken);
    const refresh = verifyRefreshToken(refreshToken);

    if (refresh) {
      if (!access) {
        const accessToken = signAccessToken({
          username: refresh,
        });
        res.cookie("POSTMINDER_ACCESS_TOKEN", accessToken);
      }
      res.sendStatus(200);
    } else {
      throw "hello";
    }
  } catch (error) {
    console.error("error : ", error);
    res.cookie("POSTMINDER_ACCESS_TOKEN", "", { maxAge: 0 });
    res.cookie("POSTMINDER_REFRESH_TOKEN", "", { maxAge: 0 });
    res.sendStatus(401);
  }
}
