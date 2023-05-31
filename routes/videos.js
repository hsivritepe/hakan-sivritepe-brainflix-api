const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
// const videos = [
//     {
//         id: '84e96018-4022-434e-80bf-000ce4cd12b8',
//         title: 'BMX Rampage: 2021 Highlights',
//         channel: 'Red Cow',
//         image: 'https://i.imgur.com/l2Xfgpl.jpg',
//         description:
//             'On a gusty day in Southern Utah, a group of 25 daring mountain bikers blew the doors off what is possible on two wheels, unleashing some of the biggest moments the sport has ever seen. While mother nature only allowed for one full run before the conditions made it impossible to ride, that was all that was needed for event veteran Kyle Strait, who won the event for the second time -- eight years after his first Red Cow Rampage title',
//         views: '1,001,023',
//         likes: '110,985',
//         duration: '4:01',
//         video: 'https://project-2-api.herokuapp.com/stream',
//         timestamp: 1626032763000,
//         comments: [
//             {
//                 id: '35bba08b-1b51-4153-ba7e-6da76b5ec1b9',
//                 name: 'Micheal Lyons',
//                 comment:
//                     'They BLEW the ROOF off at their last event, once everyone started figuring out they were going. This is still simply the greatest opening of an event I have EVER witnessed.',
//                 likes: 0,
//                 timestamp: 1628522461000,
//             },
//             {
//                 id: '091de676-61af-4ee6-90de-3a7a53af7521',
//                 name: 'Gary Wong',
//                 comment:
//                     'Every time I see him shred I feel so motivated to get off my couch and hop on my board. He’s so talented! I wish I can ride like him one day so I can really enjoy myself!',
//                 likes: 0,
//                 timestamp: 1626359541000,
//             },
//             {
//                 id: '66b7d3c7-4023-47f1-a02c-520c9ca187a6',
//                 name: 'Theodore Duncan',
//                 comment:
//                     'How can someone be so good!!! You can tell he lives for this and loves to do it every day. Every time I see him I feel instantly happy! He’s definitely my favorite ever!',
//                 likes: 0,
//                 timestamp: 1626011132000,
//             },
//         ],
//     },
// ];

router.get('/', (req, res) => {
    const videosJSON = fs.readFileSync('./data/video-details.json');
    // console.log(videosJSON);
    const videos = JSON.parse(videosJSON);
    let shortDetailVideoList = videos.map((video) => {
        return {
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image,
        };
    });

    res.send(shortDetailVideoList);
});

router.get('/:id', (req, res) => {
    const videoDetailsJSON = fs.readFileSync(
        './data/video-details.json'
    );
    const videoDetails = JSON.parse(videoDetailsJSON).find(
        (item) => item.id === req.params.id
    );

    res.status(200).send(videoDetails);
});

router.post('/', (req, res) => {
    const videoDetailsJSON = fs.readFileSync(
        './data/video-details.json'
    );
    const videoDetails = JSON.parse(videoDetailsJSON);

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
    };

    videoDetails.push(newVideo);

    const videoDetailsStringified = JSON.stringify(videoDetails);
    fs.writeFileSync(
        './data/video-details.json',
        videoDetailsStringified
    );

    res.status(201).send('New Video successfully posted.');
});

router.post('/:videoId/comments', (req, res) => {
    const videoDetailsJSON = fs.readFileSync(
        './data/video-details.json'
    );
    const videoDetails = JSON.parse(videoDetailsJSON);

    // Find the video and comments section of that video
    const found = videoDetails.find(
        (item) => item.id === req.params.videoId
    ).comments;

    const newComment = {
        ...req.body,
        id: uuidv4(),
        timestamp: Date.now(),
    };
    found.push(newComment);

    const videoDetailsStringified = JSON.stringify(videoDetails);
    fs.writeFileSync(
        './data/video-details.json',
        videoDetailsStringified
    );

    res.send(req.body);
    // res.send(videoDetails);
});

router.delete('/:videoId/comments/:commentId', (req, res) => {
    const videoDetailsJSON = fs.readFileSync(
        './data/video-details.json',
        (err, data) => {
            if (err) {
                return res.status(500).send(err);
            }
        }
    );
    const videoDetails = JSON.parse(videoDetailsJSON);

    const videoIndex = videoDetails.findIndex(
        (video) => video.id === req.params.videoId
    );
    if (videoIndex === -1) {
        return res
            .status(500)
            .send('Can not find the video, check the video ID');
    }

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

    const videoDetailsStringified = JSON.stringify(videoDetails);
    fs.writeFileSync(
        './data/video-details.json',
        videoDetailsStringified
    );

    res.status(200).send(videoDetails);
});

module.exports = router;
