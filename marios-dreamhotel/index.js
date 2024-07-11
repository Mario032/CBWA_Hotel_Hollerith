// Version 1.5 with Events

const express = require('express');
const path = require('path');
const axios = require('axios');
const mysql = require('mysql2');
// const Minio = require('minio'); // Uncomment for MinIO integration later
const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
//My SQL Parser adding Middleware to body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Integration Weather API
const stuttgartWeatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=48.7758&longitude=9.1829&current_weather=true';
const lasPalmasWeatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=28.1235&longitude=-15.4361&current_weather=true';

// Placeholder image URL
const imageUrl = 'https://www.americanexpress.com/en-us/travel/discover/photos/324/2675/1600/BAA-Hotel-Exterior.jpg?ch=560';

app.get('/', async (req, res) => {
    try {
        const [stuttgartResponse, lasPalmasResponse] = await Promise.all([
            axios.get(stuttgartWeatherUrl),
            axios.get(lasPalmasWeatherUrl)
        ]);

        const stuttgartWeather = stuttgartResponse.data.current_weather;
        const lasPalmasWeather = lasPalmasResponse.data.current_weather;
        
        res.render('overview', {
            imageUrl,
            stuttgartWeather,
            lasPalmasWeather
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.render('overview', { 
            imageUrl,
            stuttgartWeather: null,
            lasPalmasWeather: null 
        });
    }
});


// MinIO client setup (commented out for now)
// const minioClient = new Minio.Client({
//     endPoint: 'play.min.io',
//     port: 9000,
//     useSSL: true,
//     accessKey: 'YOURACCESSKEY',
//     secretKey: 'YOURSECRETKEY'
// });


// MySQL connection 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',

    password: 'admin123',
    database: 'hotel_booking'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});





// Routes
app.get('/', (req, res) => {
    // Placeholder for MinIO integration
    const imageUrl = 'https://www.americanexpress.com/en-us/travel/discover/photos/324/2675/1600/BAA-Hotel-Exterior.jpg?ch=560';

    // Render the overview page with the placeholder image URL
    res.render('overview', { imageUrl });
});

app.get('/rooms', (req, res) => {
    // Placeholder for MinIO integration
    const imagePlaceholder = 'https://via.placeholder.com/800x400';

    // Render the rooms page with placeholder image URLs
    res.render('rooms', { imagePlaceholder });
});

app.get('/restaurant', (req, res) => {
    // Placeholder for MinIO integration
    const imagePlaceholder = 'https://via.placeholder.com/800x400';

    // Render the restaurant page with placeholder image URLs
    res.render('restaurant', { imagePlaceholder });
});

app.get('/well-being', (req, res) => {
    // Placeholder for MinIO integration
    const imagePlaceholder = 'https://via.placeholder.com/800x400';

    // Render the well-beining page with placeholder image URLs
    res.render('well-being', { imagePlaceholder });
});

app.get('/gallery', (req, res) => {
    // Placeholder for MinIO integration
    const imagePlaceholder = 'https://via.placeholder.com/800x400';

    // Render the gallery page with placeholder image URLs
    res.render('gallery', { imagePlaceholder });
});

app.get('/exclusive-offers', (req, res) => {
    // Placeholder for MinIO integration
    const imagePlaceholder = 'https://via.placeholder.com/800x400';

    // Render the exclusive-offers page with placeholder image URLs
    res.render('exclusive-offers', { imagePlaceholder });
});

    // Render the checkout page & MySQL Integration

// Step 4: Implement the /checkout Route
app.get('/checkout', (req, res) => {
    const query = 'SELECT * FROM bookings';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            res.render('checkout', { bookings: [] });
        } else {
            res.render('checkout', { bookings: results });
        }
    });
});

//  Add bookings via the /book Route
app.post('/book', (req, res) => {
    const { type, description } = req.body;
    const query = 'INSERT INTO bookings (type, description) VALUES (?, ?)';
    db.query(query, [type, description], (err, result) => {
        if (err) {
            console.error('Error inserting booking:', err);
            res.sendStatus(500);
        } else {
            res.redirect('/checkout');
        }
    });
});

// Delete all bookings
app.post('/delete-bookings', (req, res) => {
    const query = 'DELETE FROM bookings';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error deleting bookings:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/checkout');
        }
    });
});

// Add personal details
//app.post('/personal-details', (req, res) => {
    //const { firstName, lastName, address, iban } = req.body;
    //const query = 'INSERT INTO personal_details (first_name, last_name, address, iban) VALUES (?, ?, ?, ?)';
    //db.query(query, [firstName, lastName, address, iban], (err, result) => {
        //if (err) {
            //console.error('Error inserting personal details:', err);
            //res.status(500).send('Internal Server Error');
        //} else {
            //res.redirect('/checkout');
        //}
    //});
//});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

