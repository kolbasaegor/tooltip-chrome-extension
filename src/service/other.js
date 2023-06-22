import { getAvailableRolesDB } from "../db/db.js";

/**
 * Transforms JSON object to []
 * @param {JSON} rolesJson json object
 * @returns [roles]
 */
export const pullRoles = async (rolesJson) => {
    var roles = [];
    for (let roleJson of rolesJson) {
        roles.push(roleJson.role);
    }

    return roles;
}

/**
 * Roles for which a tooltip set has not yet been created
 * @param {string} url url
 * @returns [roles]
 */
export const getAvailableRoles = async (url) => {
    return await getAvailableRolesDB(url);
}

