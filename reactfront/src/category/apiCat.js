export const create = (userId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/cat/new/${userId}`, {
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
    return fetch(`${process.env.REACT_APP_API_URL}/cat`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const catById = (catId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/cat/${catId}`, {
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const catDataById = (catDataId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/cat/${catDataId}`, {
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const update = (catId, token, cat) => {
    return fetch(`${process.env.REACT_APP_API_URL}/cat/${catId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: cat
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};