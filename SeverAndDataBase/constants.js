const { MongoClient } = require('mongodb');
const client = new MongoClient("mongodb+srv://nandunandakishor345:X8jr5NYLH4eJY6EB@nandakishor.784ux.mongodb.net/");

const dbName = 'Demo';

 async function main(){
    await client.connect();
    console.log("Success");
    const db = client.db(dbName);
    const collection = db.collection("User");

    const data = {
            name: 'Nandu',
            class: 'CSE',
            Roll: 480 
    }

    const insert = await collection.insertMany([data])

    const result = await collection.find({}).toArray();
    console.log(result);
    return "done"
}

main().then(console.log).catch(console.error).finally(() => client.close())
