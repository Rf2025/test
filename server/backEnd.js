const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8200;


app.use(express.json());


app.set('trust proxy', 1);

// sets build folder to be used as static 
app.use(express.static(path.join(__dirname, 'build')));



// create connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database', err);
    } else {
        console.log('Connected to database');
    }
});

// Route to fetch products from the database
app.get('/product/items', (req, res) => {
    connection.query('SELECT product_name, product_description, product_image, product_price,setup_type FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching products', err);
            res.status(500).json({  'Failed to fetch products':err});
        } else {
            console.log('PRODUCTS::', results);
            res.json(results);
        }
    });
});


// handles form submission
app.post('/form', (req, res) => {
    const data = req.body;
    console.log('User data:', data);
    res.send('Received user data');
});

// serves react appp
app.use(express.static('build'));



// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
