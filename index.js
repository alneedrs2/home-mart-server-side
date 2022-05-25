const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqkeq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const toolCollection = client.db("homeMart").collection("tool");
    const orderCollection = client.db("homeMart").collection("order");

    app.get("/tool", async (req, res) => {
      const query = {};
      const cursor = toolCollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });

    app.get("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tool = await toolCollection.findOne(query);
      res.send(tool);
    });

    app.put("/tool/:id", async (req, res) => {
      const id = req.params.id;
      const updateTool = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateTool.name,
          price: updateTool.price,
        },
      };
      const result = await toolCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.get("/order", async (req, res) => {
      const customer = req.query.customer;
      const query = { customer: customer };
      const order = await orderCollection.find(query).toArray();
      res.send(order);
    });

    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("home is running waiting for mart");
});

app.listen(port, () => {
  console.log("homeMart is running on port", port);
});
