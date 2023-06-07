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

export const getTooltipsDB = async (url, type) => {
    const { data, error } = await _supabase
    .from('available_url')
    .select(`tooltip_set ( options, steps, type )`)
    .eq('url', url);

    if (data.length == 0) return null;

    const sets = data[0].tooltip_set;
    for (const set of sets) {
        if (set.type == type) return set;
    }

    return sets.find(set => set.type == "default");
}

const getRole = async (login) => {
    const { data, error } = await _supabase
    .from('role')
    .select('role')
    .eq('login', login)
    .limit(1);

    if (data.length == 0) return "default";

    return data[0].role;
}

export const getUserDB = async (login, password) => {
    const { data, error } = await _supabase
    .from('user')
    .select('login')
    .eq('login', login)
    .eq('password', password)
    .limit(1);
    
    if (data.length == 0) return null;

    const role = await getRole(login);
    return {
        user: {
            isLoggedIn: true,
            login: login,
            status: role
        }
    }
}

export const registerUserDB = async (login, password) => {
    const { data } = await _supabase
    .from('user')
    .select('id')
    .eq('login', login)
    .limit(1);

    if (data.length > 0) return {
        status: false,
        error: "user already registered"
    };

    const { error } = await _supabase
    .from('user')
    .insert({
        login: login,
        password: password
    })

    return {
        status: !error ? true : false,
        error: error
    }
}