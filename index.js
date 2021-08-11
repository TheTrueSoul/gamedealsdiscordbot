const snoowrap = require('snoowrap');
const Discord = require('discord.js');
const client = new Discord.Client();
var utc = 0
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

function syncFunc() {
    submissions.reverse()
    console.log(submissions.length)
    for (let index = 0; index < submissions.length; index++) {
        if (submissions[index].created_utc <= process.env.utc) {
        } else {
            currentChannel.send(submissions[index].title + ' ' + submissions[index].url);
            process.env.utc = submissions[index].created_utc
        }
    }
    submissions = []
    console.log(submissions.length)
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