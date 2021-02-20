// bleu score algorithm is used in machine translation to evaluate model performance
// by checking how similar was the machine translation to a reference human generated translation.
// Similarity is measured based on how many word based unigrams, bigrams, treegram, ..., ngrams, the
// two sentenses have in common, with a score ranging from 0 to 1.
// This version of the algorithm uses character ngrams instead of words, and compares the query to the 
// artist names. 

const _ = require('underscore');

// ignore fields except for _id and name
// O ( N ), where N is the number of artists
const parseArtist = (artist) => _.pick(artist, ["_id", "name"]);

// calculate bleu scores for all artists
// O ( N * ( n * (Q + A) ) )
function bleuScores(artists, query){
    console.log("bleu scores");    
    return artists.map(artist => bleuScore(parseArtist(artist), query));
}

// calculate blue score for query and artist name
// O ( n * (Q + A) ) where n is the max N-gram size, Q is the query length, and A is the artist name length  
function bleuScore(artist, query){

    // convert artist name and query to lower case and trim white spaces
    const artistName = artist.name.toLowerCase().trim();
    query = query.toLowerCase().trim();

    // max N-gram size  
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