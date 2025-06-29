import axios from "axios";

export async function authenticToken() {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/validate-token`,
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) return true;
  } catch (err) {
    if (err.staus === 401) return false;
  }
}

export function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
