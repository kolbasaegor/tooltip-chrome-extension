import { getUserDB, registerUserDB } from "../db/db.js";

/**
 * Сheks if object is empty (obj == {})
 * @param {Object} obj 
 * @returns boolean
 */
const isEmptyObject = (obj) => {
  return Object.keys(obj).length == 0;
}

/**
 * Retrieves a user from the database.
 * If there is one, put it in storage
 * @param {string} login 
 * @param {password} password 
 * @returns boolean
 */
export const loginUser = async (login, password) => {
  const user = await getUserDB(login, password);

  if (!user) return false;

  chrome.storage.local.set(user);
  return true;
}

/**
 * Stores an unauthorized user
 */
export const logoutUser = async () => {
  chrome.storage.local.set({
    user: {
      isLoggedIn: false,
      login: null,
      roles: [{ role: "default", color: '#6b6b6b' }]
    }
  });
}

/**
 * Registers a user in the database
 * @param {string} login 
 * @param {password} password 
 * @returns boolean
 */
export const registerUser = async (login, password) => {
  const answer = await registerUserDB(login, password);
  return answer;
}

/**
 * If the user does not exist, it creates it
 * @returns user
 */
export const getUser = async () => {
  const user = await chrome.storage.local.get(["user"]);

  if (isEmptyObject(user)) {
    const unauthorizedUser = createUnauthorizedUser();
    return unauthorizedUser;
  }

  return user.user;
}

/**
 * Creates unauthorized user
 * @returns new user
 */
const createUnauthorizedUser = () => {
  const newUser = {
    user: {
      isLoggedIn: false,
      login: null,
      roles: [
        {
          role: "default",
          color: '#6b6b6b'
        }
      ]
    }
  };

  chrome.storage.local.set(newUser);
  return newUser.user;
}
