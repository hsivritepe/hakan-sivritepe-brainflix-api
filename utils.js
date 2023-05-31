const fs = require('fs');

function readFileFromServer(fileName) {
    const videoDetailsJSON = fs.readFileSync(
        fileName,
        (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
        }
    );
    const videoDetails = JSON.parse(videoDetailsJSON);

    return videoDetails;
}

function writeFileToServer(videoDetails, fileName) {
    const videoDetailsStringified = JSON.stringify(videoDetails);
    fs.writeFileSync(fileName, videoDetailsStringified);
}

module.exports = {
    readFileFromServer,
    writeFileToServer,
};
