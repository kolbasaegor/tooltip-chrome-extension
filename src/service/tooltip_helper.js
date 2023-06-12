import { isTooltipsDomainDB, isTooltipsUrlDB, getTooltipSetsDB } from "../db/db.js";
import { getCookie } from "./cookie.js";

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
  const cookieName = on === "site" ? "tooltips_enabled_site" : "tooltips_enabled_url";
  const cookie = await getCookie(url, cookieName);

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