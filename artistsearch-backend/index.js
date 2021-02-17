const express = require('express')
const Artist = require('./models/artist');
const bleuScores = require('./helpers/bleuScores');
const cors = require('cors');
const sortList = require('./helpers/sortList');
const { map } = require('underscore');

const app = express();

const router = express.Router();

app.use(cors());

router.post('/:artist_name', async (req, res) => {
  try{
    const artist_name = req.params.artist_name;

    const artists = await Artist.find();   
    const scoredArtists = bleuScores(artists, artist_name);
    
    const sortedScoredArtists = sortList(scoredArtists, "score");

    const rankedArtists = sortedScoredArtists.map((artist, index) => ({...artist, rank:index+1}));
    
    console.log(rankedArtists);
    
    return res.status(200).send(rankedArtists.slice(0, 20)); 
    
  }catch(err){
    console.log(err);
    return res.status(500).send("Internal Server Error.");
  }
});

router.post('/', async (req, res) => {
  return res.status(200).send([]);
})


app.use('/api/query', router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));