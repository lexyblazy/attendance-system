const User = require('./models/user');
async function removeUsers(){
    try {
      await User.remove();
      console.log('All users have been removed');
  
    } catch (error) {
      console.log('something went wrong')
    }
  }


module.exports = removeUsers;