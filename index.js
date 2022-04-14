const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s88xr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const serviceCollection = client.db("autoShop").collection("services");
    const reviewCollection = client.db("autoShop").collection("reviews");
    const orderCollection = client.db("autoShop").collection("orders");
    const adminCollection = client.db("autoShop").collection("admin");

    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    });

    app.get('/reviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    });

    app.get('/service/:id', (req, res) => {
        serviceCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, item) => {
                res.send(item[0]);
            })
    });

    app.get('/orders', (req, res) => {
        orderCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/isAdmin', (req, res) => {
        adminCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents.length > 0);
            })
    });

    app.get('/allOrders', (req, res) => {
        orderCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    });

    app.post('/addService', (req, res) => {
        const services = req.body;
        serviceCollection.insertOne(services)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    });

    app.post('/addReview', (req, res) => {
        const reviews = req.body;
        reviewCollection.insertOne(reviews)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    });

    app.post('/addOrder', (req, res) => {
        const orders = req.body;
        orderCollection.insertOne(orders)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    });

    app.patch('/updateStatus/:id', (req, res) => {
        orderCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { status: req.body.status }
            })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    });

    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            })
    });

    app.delete('/deleteService/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        serviceCollection.findOneAndDelete({ _id: id })
            .then(result => {
                console.log("product deleted successfully");
                res.send(result);
            })
    });

});

app.listen(port);