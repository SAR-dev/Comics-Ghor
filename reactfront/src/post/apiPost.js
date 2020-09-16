export const create = (userId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/new/${userId}`, {
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

export const listSeries = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/series`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};
export const listCat = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/cat`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// export const list = () => {
//     return fetch(`${process.env.REACT_APP_API_URL}/posts`, {
//         method: "GET",
//     })
//     .then(response => {
//         return response.json()
//     })
//     .catch(err => console.log(err))
// };
export const list = page => {
    return fetch(`${process.env.REACT_APP_API_URL}/posts/?page=${page}`, {
        method: "GET"
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const singlePost = (postId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "GET",
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const remove = (postId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
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

export const update = (postId, token, post) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const like = (userId, token, postId, ownerId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/like`, {
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

export const unlike = (userId, token, postId, ownerId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/unlike`, {
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

export const comment = (userId, token, postId, comment, ownerId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/comment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId, comment, ownerId})
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const uncomment = (userId, token, postId, comment, ownerId) => {
    return fetch(`${process.env.REACT_APP_API_URL}/post/uncomment`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId, comment, ownerId})
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};