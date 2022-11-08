const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cklgizg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db("photography").collection('services');
        app.get('/services', async (req, res) => {
            const quary = {}
            const cursor = serviceCollection.find(quary);
            const services = await cursor.toArray();
            res.send(services);

        });
    } finally {

    }

}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send('Rakibs  photography server is running now');
})
app.listen(port, () => {
    console.log(`Rakibs server is running on ${port}`)
})