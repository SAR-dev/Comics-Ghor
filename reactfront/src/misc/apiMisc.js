import queryString from 'query-string';

export const listSearch = (params) => {
    let query = queryString.stringify(params)
    return fetch(`${process.env.REACT_APP_API_URL}/posts/search?${query}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const userSearch = (params) => {
    let query = queryString.stringify(params)
    return fetch(`${process.env.REACT_APP_API_URL}/user/search?${query}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const bloodSearch = (params) => {
    let query = queryString.stringify(params)
    return fetch(`${process.env.REACT_APP_API_URL}/user/blood/search?${query}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};