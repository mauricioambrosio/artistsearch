const _ = require('underscore');

// ignore fields except for _id and name
const parseArtist = (artist) => _.pick(artist, ["_id", "name"]);

// calculate bleu scores for all artists
function bleuScores(artists, query){
    console.log("bleu scores");    
    return artists.map(artist => bleuScore(parseArtist(artist), query));
}

// calculate blue score for query and artist name
function bleuScore(artist, query){

    // convert artist name and query to lower case and trim white spaces
    const artistName = artist.name.toLowerCase().trim();
    query = query.toLowerCase().trim();

    // N-gram value 
    N = 2;
    
    nGrams = {};
    totals = {};

    // for each N-gram value 
    for(n=1; n <= N; n++) {

        nGrams[n] = {}

        // for each character n-grams in artist name
        for(i=0; i<artistName.length; i++){
            // get substring value and return if it is smaller than n. happens at the end of the string when there are not enough characters    
            let gram = artistName.substring(i, i+n);
            if (gram.length !== n) continue;

            // update nGrams dictionary 
            if(nGrams[n][gram] === undefined){
                nGrams[n][gram] = {count: 1, countRef: 0};
            } else {
                nGrams[n][gram].count++;
            }  
        }

        // for each character n-grams in query
        for(i=0; i<query.length; i++){
            // get substring value and return if it is smaller than n. happens at the end of the string when there are not enough characters
            let gram = query.substring(i, i+n);
            if (gram.length !== n) continue;

            // update nGrams dictionary
            if(nGrams[n][gram] === undefined){
                nGrams[n][gram] = {count:0, countRef: 1};
            } else {
                nGrams[n][gram].countRef++;
            }
        }
        
        totals[n] = {};

        // calculate count clips from bleu score algorithm and add to totals dictionary
        for(let gram in nGrams[n]){

            const countClip = Math.min(nGrams[n][gram].count, nGrams[n][gram].countRef);
            nGrams[n][gram].countClip = countClip;
            
            if (totals[n].countClip === undefined) totals[n].countClip = countClip;
            else totals[n].countClip += countClip;
        }
        
        // calculate count and precition and update totals dictionary
        totals[n] = {...totals[n], count: artistName.length + 1 - n};
        totals[n] = {...totals[n], precision: totals[n].countClip / totals[n].count};
    }

    // calculate brevity penalty from bleu score algorithm
    const brevityPenalty = calcBrevityPenalty(artistName, query);

    // calculate bleu score based on equation bleu = mult(pn ** wn) across n = 1 -> N 
    const wn = 1 / N;
    const zero = 1/(10 ** 7);
    let bleu = 1;
    for(n=1; n<=N; n++){
        let precision = totals[n].precision;
        bleu *= (precision === 0? zero: precision ** wn);
    }
    
    // add brevity penalty
    bleu *= brevityPenalty;

    return {...artist, score: bleu, brevityPenalty: brevityPenalty};
}

// calculate penalty for when artistName is smaller than query 
function calcBrevityPenalty(artistName, query) {

    if (artistName.length > query.length) return 1;
    else return Math.exp(1 - (query.length / artistName.length));
}



module.exports = bleuScores;