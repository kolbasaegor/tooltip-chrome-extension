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
    .eq('url', url)
    .eq('tooltip_set.type', type);

    if (data.length == 0) return null;

    return data[0].tooltip_set[0];
}