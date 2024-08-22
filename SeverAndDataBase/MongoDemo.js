const {MongoClient} = require('mongodb');

const url  = "mongodb+srv://nandunandakishor345:X8jr5NYLH4eJY6EB@nandakishor.784ux.mongodb.net/";

const client = new MongoClient(url);

async function run(){
    try {
        
        const database = client.db('Demo');
        const user = database.collection('User');
        
        const querry = {name:"Nandu"};
        const result = await user.findOne(querry);
        console.log(result)
    } catch (error) {
        console.log(error)
    }
    await client.close();
}

run();