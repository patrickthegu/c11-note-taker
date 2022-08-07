// Import express package
const express = require('express');
const path = require('path');
const fs = require('fs');

// Require JSON file and assign to noteData
const noteData = require('./db/db.json');
const PORT = 3001;

// Initialize app variable
const app = express();



// Express middleware to parse JSON data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Serve assets from public directory
app.use(express.static('public'));


// GET Routes

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
   res.json(noteData);
});

// POST routes

app.post('/api/notes', (req, res) => {
    // Log that a post request has been received
    console.info(`${req.method} request received`);

    let newNote = req.body;

    // assign id parameter in new note
    newNote.id = noteData.length;
    
    // Push new note to note data file
    noteData.push(newNote);

    // Writes note data with updated notes
    fs.writeFile('./db/db.json', JSON.stringify(noteData), (err) => {
        if (err) throw err;
        console.log('Notes updated');
    });

    // updates page
    res.json(noteData);
});

// Server begins listening
app.listen(PORT, function(){
    console.log(`App listening on Port ${PORT}`);
});

// Default redirect to root
app.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, 'public/index.html' ));
  });