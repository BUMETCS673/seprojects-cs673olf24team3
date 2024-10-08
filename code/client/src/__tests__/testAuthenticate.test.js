import { authenticated } from "../utils/authenticate";
import jwt from 'jsonwebtoken'

describe('Testing authentication', () => {
    beforeEach(() => {
        localStorage.clear();
        delete window.location;
        window.location = { href: '' };
    });

    test('User is logged in', () => {
        const secretKey = process.env.SECRET_KEY;
        const valid = jwt.sign(
            { userId: "mock", email: "mock@mail.com" },
            "mocksecret",
            { expiresIn: '1h' }
        );
        localStorage.setItem("authToken", valid);
        expect(window.location.href).toBe('');
        authenticated();
        expect(window.location.href).toBe('');
    });

    test('User is not logged in', () => {
        authenticated();
        expect(window.location.href).toBe('/login');
    });

    test('Token has expired', () => {
        const secretKey = process.env.SECRET_KEY;
        const expired = jwt.sign(
            { userId: "mock", email: "mock@mail.com" },
            "mocksecret",
            { expiresIn: '0h' }
        );
        localStorage.setItem("authToken", expired);
        authenticated();
        expect(window.location.href).toBe('/login');
    });
});