const express = require('express');
const cors = require('cors');
const port = process.env.port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lpawjga.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// local base : http://localhost:5000/

async function run() {
    try {
        const postsCollection = client.db('socialBook').collection('post');
        const usersCollection = client.db('socialBook').collection('user');

        //add & update  user
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)

            res.send(result)
        });


        //Get all todo with Pagination
        app.get('/getUser', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            res.send(user);
        })
        //Get all todo with Pagination
        app.get('/getposts', async (req, res) => {
            const query = {}
            const posts = await postsCollection.find(query).toArray();
            res.send(posts);
        })

        //Add a single todo 
        app.post('/addpost', async (req, res) => {
            const addData = req.body;
            const result = await postsCollection.insertOne(addData);
            res.send(result);
        })

        //Update a single todo by id
        app.patch('/updatepost/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };

            const updateDoc = {
                $set: { comment: updateData }
            }
            const info = await postsCollection.updateOne(filter, updateDoc, option);
            res.send(info);
        })


    }
    finally {

    }
}
run().catch(console.log())



app.get('/', async (req, res) => {
    res.send('social book running');
})

app.listen(port, () => console.log('social book', port))