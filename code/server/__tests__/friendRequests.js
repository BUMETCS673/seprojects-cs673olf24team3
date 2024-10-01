import { getModel , closeConnection} from '../db.js'

try {
    //mock
    const User = getModel().userModel
    const user1 = new User({
        userId: 10001,
        email: "test@gmail.com",
        passwordHashed: "pa55w0rd",
        name: "John Smith"
    })
    const user2 = new User ({
        userId: 10002,
        email: "hello@bu.edu",
        passwordHashed: "b0st0nuniversity",
        name: "Jane Doe",
        requests: {'test@gmail.com': 'hey'}
    })

    //test
    test("friend request received", () => {
        user1.request(user2)
        expect(user2.friendRequestsReceived.includes(user1.email)).toBe(true)
    })
    test("friend request accepted", () => {
        user2.accept(user1)
        expect(user2.friends.includes(user1.email)).toBe(true)
        expect(user1.friends.includes(user2.email)).toBe(true)
    })
} finally {
    closeConnection()
}



