// This function can be called to ensure the user is logged in before viewing a page
// If they are not, or their session has expired, they will be redirected to the login page.

import { parseCookies } from 'nookies';

export function authenticated() {
    const cookies = parseCookies();
    const token = cookies.authToken
    if (!token) {
        window.location.href = '/login';
    }
    else {
        const valid = validateToken(token);
        if (!valid) {
            window.location.href = '/login';
        }
    }
    return token
}
  
function validateToken(token) {
    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
    } catch (e) {
        return false;
    }
}