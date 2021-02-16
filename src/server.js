const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const GoogleImages = require('google-images');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log(process.env.google_images_cses)
console.log(process.env.google_images_keys)

const cses = process.env.google_images_cses.split(',')
const keys = process.env.google_images_keys.split(',')
const clients = cses.map((cse, index) => new GoogleImages(cse, keys[index]))
let currentClient = 0

console.log(clients)

app.get('/images/new_search', function (req, res) {
    currentClient = 0
})

app.get('/images/:search/:page', async function (req, res) {
    const search = req.params.search
    const page = req.params.page
    try {
        const result = await searchImages(search, page)
        res.status(200).json(result)
    }
    catch (error) {
        console.error(`failed fetching. current client: ${currentClient}`, error)
        res.status(500).json({ error })
    }
})

async function searchImages(search, page) {
    console.log(`searching for ${search}, page: ${page}`)
    try {
        return await clients[currentClient].search(search, { page })
    } catch (error) {
        console.error(`failed fetching. current client: ${currentClient}`, error)
        currentClient += 1;
        if (currentClient === clients.length) {
            currentClient = 0;
            console.error("no more clients left")
            throw error;
        }
        return searchImages(search, page)
    }
}

app.listen(process.env.PORT || 8080);
