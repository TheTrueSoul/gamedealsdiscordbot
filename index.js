const snoowrap = require('snoowrap');
const Discord = require('discord.js');
const client = new Discord.Client();
var utc = process.env.utc
var submissions = []
var currentChannel;

client.login(process.env.TOKEN);

const r = new snoowrap({
    userAgent: 'gamedealsDiscordBot',
    clientId: '_RiNfMMa8z1k6w',
    clientSecret: 'BEI2MgxKWjuHJoGk-EDFqIJNyMA',
    refreshToken: '472092989087-TmlQ_dVvaxF7xS6i8uh3DLxQZiM'
});

client.on('ready', () => {
    console.info(`logged in as ${client.user.tag}!`);
    client.user.setActivity('!start', {
        type: 'LISTENING'
    });
});

r.config({ continueAfterRatelimitError: true });
console.log('Starting Feed..')

client.on('message', message => {
    if (message.content === '!start') {
        currentChannel = message.channel
        currentChannel.send('Starting Feed...');
        main()
    }
});

var http = require("http");
setInterval(function() {
    http.get("http://<your app name>.herokuapp.com");
}, 300000); // every 5 minutes (300000)

function syncFunc() {
    submissions.reverse()
    for (let index = 0; index < submissions.length; index++) {
        if (submissions[index].created_utc <= utc) {
        } else {
            currentChannel.send(submissions[index].title + ' ' + submissions[index].url);
            utc = submissions[index].created_utc
        }
    }
    submissions = []
    main()
}

function main() {
    asyncFunc(syncFunc);
}

function asyncFunc(callback) {
    r.getSubreddit('gamedeals').getNew({ limit: 5 }).then(posts => {
        posts.map(submission => {
            submissions.push(submission)
        })
        return callback();
    })
}