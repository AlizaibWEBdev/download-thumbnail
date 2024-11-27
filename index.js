const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');

app.set("views", __dirname + "/views");
// Serve static files (like styles)
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('index', { thumbnailUrl: null, error: null }); // Include error and thumbnailUrl variables
});

// Endpoint to handle thumbnail fetching
app.get('/get-thumbnail', async (req, res) => {
    const videoUrl = req.query.url;
    try {
        if (!ytdl.validateURL(videoUrl)) {
            return res.render('index', { error: 'Invalid YouTube URL', thumbnailUrl: null });
        }

        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoId = videoInfo.videoDetails.videoId;

        // YouTube thumbnail URL
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        res.render('index', { thumbnailUrl, error: null });
    } catch (err) {
        res.render('index', { error: 'Failed to fetch thumbnail', thumbnailUrl: null });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
