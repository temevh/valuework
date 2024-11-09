const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = 5000;

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error(err);
  }
}

connectToDatabase();

const database = client.db(process.env.DB_NAME);
const collection = database.collection(process.env.DB_COLLECTION);

app.use(cors());
app.use(express.json());

app.get("/api/getquestions", async (req, res) => {
  try {
    const employee = req.query.employee === 'true';
    const collection = database.collection("questions");

    let data;
    if (employee) {
      data = await collection.find({}).toArray();
      const formattedQuestions = data.map((item) => ({
        question: item.q_e,
        answers: item.a_e,
      }));
      res.status(200).json(formattedQuestions);
    } else {
      data = await collection.find({}).toArray();
      const formattedQuestions = data.map((item) => ({
        question: item.q_s,
        answers: item.a_s,
      }));
      res.status(200).json(formattedQuestions);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
});

app.get("/api/getcompanies", async (req, res) => {
  try {
    console.log("got getquestions request");
    const data = await collection.find({}).toArray(); // Convert cursor to array
    //console.log(data)
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
});

app.post("/api/postanswer", async (req, res) => {
  const companyName = "Umbrella Corp";
  try {
    const data = req.body;
    id = data.question.id;
    answerIndex = data.answer;

    console.log("data", data);
    console.log("id", data.question.id);
    console.log("answerIndex", data.answer);

    const companyCollection = database.collection("companies");

    const company = await companyCollection.findOne({ name: companyName });

    if (company) {
      console.log("found company");
      if (company.questions && company.questions[id]) {
        const updatedQuestion = {
          ...company.questions[id],
          totalAnswerSum: company.questions[id].totalAnswerSum + answerIndex,
          totalResponses: company.questions[id].totalResponses + 1,
        };

        await companyCollection.updateOne(
          { name: companyName },
          { $set: { [`questions.${id}`]: updatedQuestion } }
        );
      } else {
        const newQuestion = {
          totalAnswerSum: answerIndex,
          totalResponses: 1,
        };

        await companyCollection.updateOne(
          { name: companyName },
          { $set: { [`questions.${id}`]: newQuestion } }
        );
      }

      res.status(201).json({ message: "Added data successfully" });
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while posting data" });
  }
});


app.listen(port, () => {
  console.log("server running on http://localhost:" + port);
});