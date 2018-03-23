// Remove accent + lowercase
export function cleanTerm(term) {
    let str = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return str.toLowerCase();
}

export function slug(str) {
    str = cleanTerm(str);
    return str.replace(/ /g,'-');
}

// Small string format : http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/
export function formatString(string, data) {
    let result = string;
    for (const entry in data) {
        if (!entry) continue;
        result = result.replace(new RegExp('{'+ entry +'}','g'), data[entry]);
    }
    return result;
}