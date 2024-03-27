const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express()
const { error } = require('console');
const port = 3000

app.use(bodyParser.json())
app.use(express.static('views'))
app.use(bodyParser.urlencoded({
    extended:true
}))

// MongoDB connection URI
mongoose.connect('mongodb://localhost:27017/Login_Form')
var db=mongoose.connection
db.on('error',()=> console.log("Error in Connecting to Database"))
db.once('open',()=> console.log("Connected to Database"))

// Create Tables 

app.post('/login_success', (request, response) => {
    var email = request.body.email;
    var password = request.body.password;

    var data = {
        "email": email,
        "password": password
    }

    // Insert Query in Stored DB
    db.collection('data').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
        return response.redirect('login_success.ejs');
    });
});

// Routes for rendering views
// app.get("/", (req, res) => {
//     res.set({
//         "Allow-acces-Allow-Origin": '*'
//     })
//     res.render('index');
// });

app.get('/login_success', (req, res) => {
    res.render('login_success');
});



app.set('view engine', 'ejs');

// Header 

app.get('/', (request,response) =>  {

    let name = "Express"
    let search = "Search Here"

    response.render("index", {name: name, search: search});
})

// Footer

// app.get('/', (request, response) => {
//     const currentYear = new Date().getFullYear();
//     // let copyright = "Umang Modi"
  
//     response.render("index", { year: currentYear, copyright: copyright });
// });

app.listen(port, () => {
    console.log("Server is Currently Running  on Port: " + port);
})





