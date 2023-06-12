export const pullRoles = async (rolesJson) => {
    var roles = [];
    for (let roleJson of rolesJson) {
        roles.push(roleJson.role);
    }

    return roles;
}