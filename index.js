const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x6lu5yx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const collegeCollection = client.db('collegeClutch').collection('colleges');
    const bookingCollection = client.db('collegeClutch').collection('bookings');

    app.get('/colleges', async(req, res) =>{
        const result = await collegeCollection.find().toArray();
        res.send(result)
    })

    app.get('/colleges/:id',async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await collegeCollection.findOne(query);
        res.send(result);
    })

    // booking
    app.get('/booking', async(req, res)=>{
        let query = {};
        if(req.query?.email){
            query = {email: req.query.email}
        }
      
        const result = await bookingCollection.find(query).toArray();
        res.send(result);
    })

    app.post('/booking', async(req, res)=>{
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('CollegeClutch is running')
})

app.listen(port, () => {
    console.log(`CollegeClutch server is running on port ${port}`);
})