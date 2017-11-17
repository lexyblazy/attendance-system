const User = require('./models/user');

const dummyUsers = [
    {name:'Adekola Olalekan'},
    {name:'lexy'},
    {name:'ghost rider'},
    {name:'All the games'}
]
  


async function seedDB(){
    try {
        const users = await User.insertMany(dummyUsers);
        console.log('successful');
        console.log(users)
    } catch (error) {
        console.log('Unsuccessful')
    }
   
    
}



module.exports = seedDB;