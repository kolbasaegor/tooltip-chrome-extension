import { _supabase } from "./supabase.js";

export const isTooltipsDomain = async (url) => {
    const { data, error } = await _supabase
    .from('available_domain')
    .select('*')
    .eq("url", url)
    .limit(1);

    return data.length === 1 ? true : false;
}

export const isTooltipsUrl = async (url) => {
    const { data, error } = await _supabase
    .from('available_url')
    .select('id')
    .eq("url", url)
    .limit(1);

    return data.length === 1 ? true : false;
}

export const getTooltips = async (url) => {
    const { data, error } = await _supabase
    .from('available_url')
    .select('options, steps')
    .eq('url', url)
    .limit(1);

    return data.length != 0 ? data[0] : null;
}