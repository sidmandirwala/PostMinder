export function getCookieValue(name) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie = `${name} = ; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}
