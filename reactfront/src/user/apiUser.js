export const read = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const list = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: "GET",
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const remove = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const update = (userId, token, user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
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

export const updateUser = (user, next) => {
    if(typeof window !== 'undefined') {
        if(localStorage.getItem('jwtC')) {
            let auth = JSON.parse(localStorage.getItem('jwtC'))
            auth.user = user
            localStorage.setItem('jwtC', JSON.stringify(auth))
            next()
        }
    }
};

export const follow = (userId, token, followId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, followId})
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const unfollow = (userId, token, unfollowId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, unfollowId})
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const findPeople = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};