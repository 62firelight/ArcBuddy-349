const express = require('express')
const cors = require('cors');
const destinyApi = require('node-destiny-2');

const app = express();
const port = 3000;

app.use(express.static('myapp/public'));
app.use(express.json());
app.use(cors());

const apiUrl = `http://localhost:${port}`

app.listen(port, () => {
    console.log(`Server running at ${apiUrl}`);
});

app.get('/', (req, res) => {
    res.send(`
  Welcome to the API homepage for Arc Buddy! There's nothing special to see here right now.
  `)
});

