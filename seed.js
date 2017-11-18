const User = require('./models/user');

const dummyUsers = [
    {name:'Adekola Olalekan'},
    {name:'lexy'},
    {name:'ghost rider'},
    {name:'Uchiha Sasuke '},
    {name:'Uchiha Itachi'},
    {name:'Uchiha Madara'},
    {name:'Uchiha Izuna'},
    {name:'Uchiha Fugaku'},
    {name:'Uchiha Obito'},
    {name:'Uchiha Shuisui'}
    
]
  


async function seedDB(){
    try {
        const users = await User.insertMany(dummyUsers);
        console.log(users)
        console.log('successful');
    } catch (error) {
        console.log('Unsuccessful')
    }
   
    
}



module.exports = seedDB;