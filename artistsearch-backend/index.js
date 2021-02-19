const express = require('express')
const Artist = require('./models/artist');
const bleuScores = require('./helpers/bleuScores');
const cors = require('cors');
const sortList = require('./helpers/sortList');


const app = express();
const router = express.Router();

// enable cors
app.use(cors());

// number of artists to return
const N_of_artists = 20;

router.post('/:artist_name', async (req, res) => {
  try{
    // get artist name from request
    const query = req.params.artist_name;

    // get artists from remote mongodb 
    const artists = await Artist.find();
    
    // calculate artist bleu scores based on query and artist names, sort based on scores and rank artists
    const scoredArtists = bleuScores(artists, query);
    const sortedScoredArtists = sortList(scoredArtists, true, "score");
    const rankedArtists = sortedScoredArtists.map((artist, index) => ({...artist, rank:index+1}));
    
    console.log(rankedArtists);
    
    // send results
    return res.status(200).send(rankedArtists.slice(0, N_of_artists)); 
    
  } catch(err){
    console.log(err);
    return res.status(500).send("Internal Server Error.");
  }
});


// return empty list if query is empty
router.post('/', async (req, res) => {
  return res.status(200).send([]);
});


app.use('/api/query', router);


// if port not given in env, use 3000 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));