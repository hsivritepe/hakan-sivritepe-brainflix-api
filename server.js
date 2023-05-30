const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json('Hakan');
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
