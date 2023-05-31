require('dotenv').config();
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const utils = require('../utils');

// Get all the videos
router.get('/', (req, res) => {
    // Read the JSON file
    const videoDetails = utils.readFileFromServer(
        process.env.JSON_FILE
    );

    // Get the necessary parts from the video details and respond back
    const shortDetailVideoList = videoDetails.map((video) => {
        return {
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image,
        };
    });

    res.send(shortDetailVideoList);
});

// Get a specific video
router.get('/:id', (req, res) => {
    // Read the JSON file
    const videoDetails = utils.readFileFromServer(
        process.env.JSON_FILE
    );

    // Find the specific video details from the video list
    const oneVideoDetails = videoDetails.find(
        (item) => item.id === req.params.id
    );

    res.status(200).send(oneVideoDetails);
});

// Create a new video
router.post('/', (req, res) => {
    // Read the JSON file
    const videoDetails = utils.readFileFromServer(
        process.env.JSON_FILE
    );

    const newVideo = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        views: Math.floor(Math.random() * 3235543),
        likes: Math.floor(Math.random() * 1452),
        timestamp: Date.now(),
        channel: "Hakan's Pub",
        image: `http://localhost:8080/images/image${
            Math.floor(Math.random() * 9) + 1
        }.jpeg`,
        comments: [],
    };

    videoDetails.push(newVideo);

    // Write the data to the file
    utils.writeFileToServer(videoDetails, process.env.JSON_FILE);

    res.status(201).send('New Video successfully posted.');
});

// Create a new video comment
router.post('/:videoId/comments', (req, res) => {
    // Read the JSON file
    const videoDetails = utils.readFileFromServer(
        process.env.JSON_FILE
    );

    // Find the video and comments section of that video
    const videoCommentArr = videoDetails.find(
        (item) => item.id === req.params.videoId
    ).comments;

    const newComment = {
        ...req.body,
        id: uuidv4(),
        timestamp: Date.now(),
    };
    videoCommentArr.push(newComment);

    // Write the data to the file
    utils.writeFileToServer(videoDetails, process.env.JSON_FILE);

    res.send(req.body);
    // res.send(videoDetails);
});

// Delete a specific video comment
router.delete('/:videoId/comments/:commentId', (req, res) => {
    // Read the JSON file
    const videoDetails = utils.readFileFromServer(
        process.env.JSON_FILE
    );

    // Get the index of the video in the array and return the error if it can not be found
    const videoIndex = videoDetails.findIndex(
        (video) => video.id === req.params.videoId
    );
    if (videoIndex === -1) {
        return res
            .status(500)
            .send('Can not find the video, check the video ID');
    }

    // Get the index of the comment in the array and return the error if it can not be found
    const commentIndex = videoDetails[videoIndex].comments.findIndex(
        (comment) => comment.id === req.params.commentId
    );
    if (commentIndex === -1) {
        return res
            .status(500)
            .send('Can not find the comment, check the comment ID');
    }

    // Delete the input comment
    videoDetails[videoIndex].comments.splice(commentIndex, 1);

    // Write the data to the file
    utils.writeFileToServer(videoDetails, process.env.JSON_FILE);

    res.status(200).send(videoDetails);
});

module.exports = router;
