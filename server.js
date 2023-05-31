const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

const videosRoutes = require('./routes/videos');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.json('Hakan');
});

app.use('/videos', videosRoutes);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
