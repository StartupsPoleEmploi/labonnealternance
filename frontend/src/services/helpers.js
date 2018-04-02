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

export function isSiret(str) {
    let pattern = new RegExp("^[0-9]{14}$");
    return pattern.test(str);
}

export function isEmail(email) {
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// See : https://docs.djangoproject.com/en/2.0/ref/csrf/#ajax
// Note : The jQuery dependency has been removed
export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}