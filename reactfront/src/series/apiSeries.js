export const create = (userId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/series/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const imageupload = (img) => {
    let formData = new FormData();
    formData.append('image', img);
    return fetch('https://api.imgur.com/3/image/', {
        method: "POST",
        headers: {
            'Authorization': `Client-ID ${process.env.REACT_APP_IMGUR_API_CLIENT}` 
        },
        body: formData
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/series`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const seriesById = (seriesId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/series/${seriesId}`, {
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const seriesDataById = (seriesDataId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/series/${seriesDataId}`, {
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const update = (seriesId, token, series) => {
    return fetch(`${process.env.REACT_APP_API_URL}/series/${seriesId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: series
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};