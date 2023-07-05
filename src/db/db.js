import { _supabase } from "./supabase.js";

export const isTooltipsDomainDB = async (url) => {
    const { data, error } = await _supabase
    .from('available_domain')
    .select('id')
    .eq("url", url)
    .limit(1);

    return data.length == 1 ? true : false;
}

export const isTooltipsUrlDB = async (url) => {
    const { data, error } = await _supabase
    .from('available_url')
    .select('id')
    .eq("url", url)
    .limit(1);

    return data.length == 1 ? true : false;
}

export const getTooltipSetsDB = async (url, roles) => {
    const { data, error } = await _supabase
    .from('tooltip_set')
    .select(`options, steps, available_url!inner ( url ), role!inner ( role, color )`)
    .eq('available_url.url', url)
    .in('role.role', roles);

    return data;
}

export const getTooltipSetByIdDB = async (id) => {
    const { data } = await _supabase
    .from('tooltip_set')
    .select(`id, options, steps, name, role!inner ( id, role, color )`)
    .eq('id', id)
    .limit(1);

    return data[0];
}

export const getTooltipSetsMetaDB = async (url) => {
    const { data, error } = await _supabase
    .from('tooltip_set')
    .select(`available_url!inner ( url ), role!inner ( role, color ), name, id`)
    .eq('available_url.url', url)

    return data;
}


export const getUserDB = async (login, password) => {
    const { data, error } = await _supabase
    .from('user')
    .select(`login, role ( role, color )`)
    .eq('login', login)
    .eq('password', password)
    .limit(1);

    if (data.length == 0) return null;

    return {
        user: {
            isLoggedIn: true,
            login: data[0].login,
            roles: data[0].role
        }
    }
}

const addDefaultRoleToUser = async (user_id) => {
    await _supabase
    .from('users_roles')
    .insert([{
        user_id: user_id,
        role_id: 1
    }])
} 

export const registerUserDB = async (login, password) => {
    const { data, error } = await _supabase
    .from('user')
    .insert([{
        login: login,
        password: password
    }])
    .select('*');

    if ( error ) {
        return {
            status: false,
            error: error.details
        };
    }

    addDefaultRoleToUser(data[0].id);

    return {
        status: true,
        error: null
    }
}

export const getAvailableRolesDB = async (url) => {
    const unavailable_roles = await _supabase
    .from('tooltip_set')
    .select('available_url!inner ( url ), role!inner ( role )')
    .eq('available_url.url', url);

    const unavailable_roles_array = unavailable_roles.data.map(x => x.role.role);

    const roles = await _supabase
    .from('role')
    .select('id, role, color');

    const available_roles = roles.data.filter(x => !unavailable_roles_array.includes(x.role));
    
    return available_roles;
}

const getAvailableDomain = async (origin) => {
    var availableDomain = await _supabase
    .from('available_domain')
    .select('id')
    .eq('url', origin)
    .limit(1);

    if (availableDomain.data.length === 0) {
        var availableDomain = await _supabase
        .from('available_domain')
        .insert({url: origin})
        .select('id');
    } 

    return availableDomain;
}

const getAvailableUrl = async (url, domainId) => {
    var availableUrl = await _supabase
    .from('available_url')
    .select('id, domain_id')
    .eq('url', url)
    .limit(1);

    if (availableUrl.data.length === 0) {
        var availableUrl = await _supabase
        .from('available_url')
        .insert({ url: url, domain_id: domainId })
        .select('id');
    }

    return availableUrl;
}

export const insertTooltipSetDB = async (origin, url, name, role, options, steps) => {
    const availableDomain = await getAvailableDomain(origin);
    const availableUrl = await getAvailableUrl(url, availableDomain.data[0].id);

    const { error } = await _supabase
    .from('tooltip_set')
    .insert({
        url_id: availableUrl.data[0].id,
        role_id: role,
        name: name,
        options: options,
        steps: steps
    });

    return error ? false : true;
}

export const removeTooltipSetDB = async (id) => {
    const { error } = await _supabase
    .from('tooltip_set')
    .delete()
    .eq('id', id);
}

export const updateTooltipSetDB = async (id, newSet) => {
    const { error } = await _supabase
    .from('tooltip_set')
    .update(newSet)
    .eq('id', id);

    return error ? false : true;
}