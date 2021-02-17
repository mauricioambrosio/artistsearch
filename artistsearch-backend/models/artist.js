const mongoconn = require('../helpers/mongoConn');

const artistSchema = new mongoconn.Schema({
    name: {type:String, required: true}
});

const Artist = mongoconn.model('Artists', artistSchema);
module.exports = Artist;