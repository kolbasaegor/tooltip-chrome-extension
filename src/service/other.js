import { getAvailableRolesDB } from "../db/db.js";

export const pullRoles = async (rolesJson) => {
    var roles = [];
    for (let roleJson of rolesJson) {
        roles.push(roleJson.role);
    }

    return roles;
}

export const getAvailableRoles = async (url) => {
    return await getAvailableRolesDB(url);
}

