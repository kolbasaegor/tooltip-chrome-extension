import { getUserDB, registerUserDB } from "../db/db.js";

const isEmptyObject = (obj) => {
  return Object.keys(obj).length == 0;
}

export const loginUser = async (login, password) => {
  const user = await getUserDB(login, password);

  if (!user) return false;

  chrome.storage.local.set(user);
  return true;
}

export const logoutUser = async () => {
  chrome.storage.local.set({
    user: {
      isLoggedIn: false,
      login: null,
      status: "default"
    }
  });
}

export const registerUser = async (login, password) => {
  const answer = await registerUserDB(login, password);

  return answer;
}

export const getUser = async () => {
  const user = await chrome.storage.local.get(["user"]);

  if (isEmptyObject(user)) {
    const newUser = {
      user: {
        isLoggedIn: false,
        login: null,
        status: "default"
      }
    };
    chrome.storage.local.set(newUser);
    return newUser.user;
  }

  return user.user;
}