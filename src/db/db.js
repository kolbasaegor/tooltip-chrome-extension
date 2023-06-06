import { _supabase } from "./supabase.js";

export const isTooltipsDomain = async (url) => {
    const { data, error } = await _supabase
    .from('available_domain')
    .select('id')
    .eq("url", url)
    .limit(1);

    return data.length == 1 ? true : false;
}

export const isTooltipsUrl = async (url) => {
    const { data, error } = await _supabase
    .from('available_url')
    .select('id')
    .eq("url", url)
    .limit(1);

    return data.length == 1 ? true : false;
}

export const getTooltips = async (url, type) => {
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

export const getUser = async (login, password) => {
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