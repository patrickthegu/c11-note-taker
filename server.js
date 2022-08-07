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
   res.json(JSON.parse(fs.readFileSync("./db/db.json")));
});

// POST routes

app.post('/api/notes', (req, res) => {
    // Log that a post request has been received
    console.info(`${req.method} request received`);

    let newNote = req.body;

    const updatedData = JSON.parse(fs.readFileSync("./db/db.json"));

    // assign id parameter in new note
    newNote.id = noteData.length;
    
    // Push new note to note data file
    updatedData.push(newNote);

    // Update index
    updatedData.forEach(element => element.id = updatedData.indexOf(element));    

    // Writes note data with updated notes
    fs.writeFileSync('./db/db.json', JSON.stringify(updatedData), (err) => {
        if (err) throw err;
        console.log('Notes updated');
    });

    // updates page
    res.json(noteData);
});

// Delete routes
app.delete('/api/notes/:id', (req, res) => {
    // Log that a delete request has been received
    console.info(`${req.method} request received`);
    let id = JSON.parse(req.params.id);

    // Remove item with id to delete
    let deleteData = (JSON.parse(fs.readFileSync("./db/db.json"))).filter(item => item.id != id);    

    // Update index
    deleteData.forEach(element => element.id = deleteData.indexOf(element));

    // Writes note data with updated notes
    fs.writeFileSync('./db/db.json', JSON.stringify(deleteData), (err) => {
        if (err) throw err;
        console.log('Note deleted');
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