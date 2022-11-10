const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, Timestamp } = require('mongodb');

require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cklgizg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db("photography").collection('services');
        const reviewCollection = client.db("photography").collection('reviews');
        app.get('/services', async (req, res) => {
            const size = parseInt(req.query.size);
            const quary = {}
            const cursor = serviceCollection.find(quary);
            const services = await cursor.limit(size).sort({ timestamp: -1 }).toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.post('/reviews', async (req, res) => {
            console.log(req.body);
            const result = await reviewCollection.insertOne(req.body)
            res.send(result)
        });
        app.get('/reviews/:id', async (req, res) => {

            const cr = reviewCollection.find({ service_id: req.params.id })
            const result = await cr.toArray()
            res.send(result)
        });
        app.get('/reviews', async (req, res) => {
            const email = req.query.email
            const id = req.params.id;
            let query
            if (email)
                query = { email: email }
            else query = {}
            const coursor = reviewCollection.find(query);
            const reviews = await coursor.toArray()
            res.send(reviews)
        });

        app.delete('/review/:id', async (req, res) => {
            const result = await reviewCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(result)
        })

        app.post('/service', async (req, res) => {
            const result = await serviceCollection.insertOne({ timestamp: new Timestamp(), ...req.body })
            res.send(result)
        })

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