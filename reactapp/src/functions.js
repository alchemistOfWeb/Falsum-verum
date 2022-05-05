import qs from 'qs';
import jquery from 'jquery';
import { BACKEND_ROOT_URL } from './setting';

// export function getCookie(name) {
//     let matches = document.cookie.match(new RegExp(
//         "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
//     ));
//     return matches ? decodeURIComponent(matches[1]) : undefined;
// }

async function requestCSRFToken() {
    let csrfToken = getCSRFtoken();
    if (csrfToken === null) {
        const response = await fetch(`${BACKEND_ROOT_URL}csrf/`, {
            credentials: 'include',
        });
        const data = await response.json();
        csrfToken = data.csrfToken;
    }
    setCookie('csrftoken', csrfToken);
    return csrfToken;
}

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

export const getCSRFtoken = function() {
    return getCookie("csrftoken");
}

export async function crdRequest(method, path, data, headers={}) {
    const csrf = await requestCSRFToken();
    console.log({csrf});
    headers = {
        "X-CSRFToken": csrf,
        // "Content-Type": "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
        ...headers
    }
    let options = {
        credentials: 'include',
    }
    return await request(method, path, data, headers, options)
}

export async function request(method, path, data={}, headers={}, options={}) {
    let params = {
        method: method,
        ...options,
    }
    if (Object.keys(data).length > 0) {
        console.log({data})
        params.body = JSON.stringify(data);
    }
    if (Object.keys(headers).length > 0) {
        console.log({headers});
        params.headers = headers;
    }
    console.log({params})
    return await fetch(path, params)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data;
        });
}

export function getAccessToken() {
    let access_token = getCookie('access_token');
    console.log({access_token});
    return access_token;
}

export async function userRequest(options={}) {
    let url = `${BACKEND_ROOT_URL}profile/`;
    let headers = {
        // "Content-Type": "application/json",
        "Authorization": getAccessToken()
    }
    const res = await request('GET', url, {}, headers, options);
    return res;
}
