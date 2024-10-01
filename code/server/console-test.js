//This file is for testing connection to the database.  It will print out data to the console.

import { getModel, closeConnection } from './db.js'

const User = getModel().userModel

async function consoleTest() {
    try {

        let users = await User.find({})
        console.log(users)

    } catch (error) {

        console.log(error)

    } finally {

        closeConnection()
        
    }
}

consoleTest()
