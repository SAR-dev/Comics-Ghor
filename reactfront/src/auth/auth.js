export const preSignup = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/pre-signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

export const signup = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

export const authenticate = (jwt, next) => {
    if(typeof window !== "undefined") {
        localStorage.setItem("jwtC", JSON.stringify(jwt))
        next()
    }
};

export const signin = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

export const signout = (next) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwtC")
        localStorage.removeItem("id")
        localStorage.removeItem("photoUrl")
        localStorage.removeItem("nickname")
        localStorage.removeItem("messages")
        localStorage.removeItem("users")
        localStorage.removeItem("added")
    }
    next()
    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
        .then(response => {
            return response.json()
        })
        .catch(err => console.log(err))
};

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false
    }
    if (localStorage.getItem("jwtC")) {
        return JSON.parse(localStorage.getItem("jwtC"))
    } else {
        return false
    }
};