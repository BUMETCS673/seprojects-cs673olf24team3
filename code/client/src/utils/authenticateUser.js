// utils/authenticateUser.js
export async function authenticateUser(credentials, userDatabase) {
    const { email, password } = credentials;
  
    //  Checking there is input data in each field
    if (!email || !password) {
      console.log('Email or password missing');
      return false;
    }
  
    // Check if the user exists in the database
    const user = userDatabase.find((user) => user.email === email);
  
    if (!user) {
      console.log('User not found');
      return false;
    }
  
    //  Compare the provided password with the stored hashed password
    if (user.password !== password) {
      console.log('Incorrect password');
      return false;
    }
  
    //  If all validations pass
    return true;
  }