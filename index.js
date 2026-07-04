const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.get('/', (req, res) => {
    res.send('Hello World! Server is running successfully');
});


const port = process.env.PORT
const uri = process.env.MONGODB_CONNECTION;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // await client.connect();

        const database = client.db("ticket-booking-user-info");
        const addTicketCollection = database.collection('all_ticket');




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});