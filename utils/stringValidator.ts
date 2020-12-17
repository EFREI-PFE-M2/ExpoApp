// Validates most email formats: https://emailregex.com/
export const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Validates username pattern:
// 3 to 32 caracters
// First symbol should be a letter and can contain numeric numbers
// https://regexr.com/2toke
export const usernameRegex = /[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi

// Validates password pattern:
// - at least 8 characters
// - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
// - Can contain special characters
// https://regexr.com/3bfsi
export const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
