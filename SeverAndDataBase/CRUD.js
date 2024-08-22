const { MongoClient } = require("mongodb");
const { insertData } = require("./constants");
const { ObjectId } = require('mongodb');


const url =
  "mongodb+srv://nandunandakishor345:X8jr5NYLH4eJY6EB@nandakishor.784ux.mongodb.net/";

const client = new MongoClient(url);

const run = async () => {
  try {
    const database = client.db("Demo");
    const user = database.collection("User");

    //returns the whole document content
    const data = await user.find().toArray();
    console.log(data);

    // inserted the data to the document!
    // await user.insertMany(insertData);
    // console.log("Inserted Succesfully");

    //updating values in the document
    // await user.updateMany(
    //     {class:"CIVIL"},
    //     {$set:{class:"CIVILE"}}
    // )
    //await user.updateMany({ class: "CSE" }, { $push: { package:8 } });

    //deleting an object from the document
    
    //await user.deleteOne({_id:"66c71a851a2f988ddcd85ed0"});
    //await user.deleteOne({ _id: new ObjectId("66c71a851a2f988ddcd85ed0") });
    // const Count = await user.countDocuments({ class: "CSE" });
    // console.log(Count)


  } finally {
    client.close();
  }
};

run();
