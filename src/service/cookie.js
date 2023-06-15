/**
 * searches for and returns cookies with the
 * given parameters, if not then creates 
 * it with a value = defaultValue
 * @param {string} url 
 * @param {string} name 
 * @param {string} defaultValue 
 * @returns cookie
 */
export const getCookie = async (url, name) => {
  const cookie = await chrome.cookies.get({ url: url, name: name });

  return cookie;
}

/**
 * set cookie with given parameters
 * @param {string} url 
 * @param {string} name 
 * @param {string} value 
 */
export const setCookie = (url, name, value) => {
  chrome.cookies.set({
    url: url, 
    name: name, 
    value: value,
    expirationDate: (new Date().getTime() / 1000) + 60*60*24*30
  });
}
