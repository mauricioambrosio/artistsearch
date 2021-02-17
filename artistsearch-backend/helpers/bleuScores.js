const _ = require('underscore');

const parseArtist = (artist) => _.pick(artist, ["_id", "name"]);

function bleuScores(artists, query){
    console.log("bleu scores");
    
    return artists.map(artist => bleuScore(parseArtist(artist), query));
}

function bleuScore(artist, query){

    const artistName = artist.name.toLowerCase().trim();
    query = query.toLowerCase().trim();

    N = 2;
    nGrams = {};
    totals = {};

    for(n=1; n <= N; n++) {

        nGrams[n] = {}

        for(i=0; i<artistName.length; i++){
            let gram = artistName.substring(i, i+n);
            if (gram.length !== n) continue;

            if(nGrams[n][gram] === undefined){
                nGrams[n][gram] = {count: 1, countRef: 0};
            } else {
                nGrams[n][gram].count++;
            }  
        }
        for(i=0; i<query.length; i++){
            let gram = query.substring(i, i+n);
            if (gram.length !== n) continue;

            if(nGrams[n][gram] === undefined){
                nGrams[n][gram] = {count:0, countRef: 1};
            } else {
                nGrams[n][gram].countRef++;
            }
        }
        
        totals[n] = {};

        for(let gram in nGrams[n]){
            const countClip = Math.min(nGrams[n][gram].count, nGrams[n][gram].countRef);
            nGrams[n][gram].countClip = countClip;
            
            if (totals[n].countClip === undefined) totals[n].countClip = countClip;
            else totals[n].countClip += countClip;
        }

        totals[n] = {...totals[n], count: artistName.length + 1 - n};
        totals[n] = {...totals[n], precision: totals[n].countClip / totals[n].count};
    }

    const brevityPenalty = calcBrevityPenalty(artistName, query);

    const wn = 1 / N;
    const zero = 1/(10 ** 7);
    let bleu = 1;
    for(n=1; n<=N; n++){
        let precision = totals[n].precision;
        bleu *= (precision === 0? zero: precision ** wn);
    }
    
    bleu *= brevityPenalty;

    return {...artist, score: bleu, brevityPenalty: brevityPenalty};
}

function calcBrevityPenalty(artistName, query) {

    if (artistName.length > query.length) return 1;
    else return Math.exp(1 - (query.length / artistName.length));
}



module.exports = bleuScores;