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
