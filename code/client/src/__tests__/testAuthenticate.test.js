import { authenticated } from "../utils/authenticate";
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie';
import { destroyCookie } from 'nookies';

describe('Testing authentication', () => {
    beforeEach(() => {
        //Clear cookie and return to default page
        destroyCookie(null, 'authToken');
        delete window.location;
        window.location = { href: '' };
    });

    test('User is logged in', () => {
        const valid = jwt.sign(
            { userId: "mock", email: "mock@mail.com" },
            "mocksecret",
            { expiresIn: '1h' }
        );
        Cookies.set('authToken', valid);
        expect(window.location.href).toBe('');
        authenticated();
        expect(window.location.href).toBe('');
    });

    test('User is not logged in', () => {
        authenticated();
        expect(window.location.href).toBe('/login');
    });

    test('Token has expired', () => {
        const expired = jwt.sign(
            { userId: "mock", email: "mock@mail.com" },
            "mocksecret",
            { expiresIn: '0h' }
        );
        Cookies.set('authToken', expired);
        authenticated();
        expect(window.location.href).toBe('/login');
    });
});