const mongoose = require('mongoose');


module.exports = class BotList{
    constructor(config){
        mongoose.connect(config.mongo.botlist.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        }).catch(console.log);

        this.Users = mongoose.model('users', new mongoose.Schema({
            _id: String
        }));

        this.Bots = mongoose.model('bots', new mongoose.Schema({
            _id: String,
            owner: {
                ref: "users",
                type: String
            },
            details: {
                prefix: String,
                library: String,
                tags: Array,
                shortDescription: String,
                otherOwners: [{
                    ref: "users",
                    type: String
                }],
                customURL: String
            },
            votes: {
                current: Number
            }
        }));
    }
}