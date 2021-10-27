
const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z45ex.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){

    try {
        await client.connect();
        const database = client.db("pracData")
        const dataCollection = database.collection("data")

        // POST API
        app.post('/addUser', async (req,res) => {
            const user = (req.body);
            // console.log('data show the post', user);
            const result = await dataCollection.insertOne(user)
            res.send(result)
        })

        // GET API
        app.get('/users', async (req,res)=>{
            const result = await dataCollection.find({}).toArray();
            res.send(result);
        })
        // DELETE API
        app.delete('/users/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await dataCollection.deleteOne(query);
            res.send(result)
        })

        // get update single products
        app.get('/users/:id', async (req,res)=>{
           const id =(req.params.id);
            const query = {_id: ObjectId(id)}
            const result = await dataCollection.findOne(query);
            res.send(result)
        })

        // finally update
        app.put('/update/:id', async (req,res)=>{
            const id = req.params.id;
            const updateInfo = req.body;
            const query = {_id: ObjectId(id)}

            dataCollection.updateOne(query,{
                $set: {
                    name: updateInfo.name,
                    email: updateInfo.email
                }
            })
            .then(result=>{
                res.send(result)
            })
    
        })
    
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)



app.get('/', (req,res)=>{
    res.send('I am ready for you,')
})

app.listen(port, ()=>{
    console.log('hitting form test',port);
})