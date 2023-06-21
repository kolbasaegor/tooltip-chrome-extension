import { isTooltipsDomainDB, isTooltipsUrlDB, getTooltipSetsDB, insertTooltipSetDB } from "../db/db.js";
import { getCookie, setCookie } from "./cookie.js";

/**
 * checks if there are tooltips for the given url
 * @param {string} on where to see
 * @param {string} url url of the page
 * @returns boolean
 */
export const isTooltipsExist = async (on, url) => {
  if (on === "site") return isTooltipsDomainDB(url);
  if (on === "url") return isTooltipsUrlDB(url);
}

/**
 * checks if tooltips enabled for the given url
 * @param {string} on where to see
 * @param {string} url url of the page
 * @returns boolean
 */
export const isTooltipsEnabled = async (on, url) => {
  if (on === "site") {
    const cookie = await getCookie(url, "tooltips_site");

    if (!cookie) {
      setCookie(url, "tooltips_site", "1");
      return true;
    }

    return cookie.value === "1" ? true : false;
  }

  const cookie = await getCookie(url, `tooltips_${url}`);

  if (!cookie) {
    setCookie(url, `tooltips_${url}`, "1");
    return true;
  }

  return cookie.value === "1" ? true : false;
}

/**
 * returns tooltips for given url
 * @param {string} url 
 * @returns JSON tooltips for given url
 */
export const getTooltipSets = async (url, roles) => {
  const data = await getTooltipSetsDB(url, roles);

  return data;
}

export const addTooltipSet = async (parameters) => {
  const answer = await insertTooltipSetDB(
    parameters.origin,
    parameters.url,
    parameters.role,
    parameters.options,
    parameters.steps
    );

  return answer;
}