const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Connection string for local MongoDB instance
        const uri = 'mongodb://localhost:27017';
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        // Use the database 'form-data' and collection 'submissions'
        const database = client.db('yomidb');
        const collection = database.collection('submission');

        // Insert the form data into the collection
        const result = await collection.insertOne({ name, email, message });
        console.log('Data saved to MongoDB:', result.insertedId);

        res.send('Form submitted successfully!');
    } catch (err) {
        console.error('Error saving data to MongoDB:', err);
        res.status(500).send('Error saving data');
    } finally {
        // Close the connection
        await client.close();
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});