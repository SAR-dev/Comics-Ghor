export const notification = (userId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/notification/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const clearLike = (userId, token, postId, ownerId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/like/clear/${ownerId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId, ownerId})
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const clearComment = (userId, token, postId, ownerId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/user/comment/clear/${ownerId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId, ownerId})
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};