// export the following utility functions
export function validateEmail(email) {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    return re.test(String(email).toLowerCase())
}

export function validatePassword(password) {
    return password.length >= 6
}