const snoowrap = require('snoowrap');
const Discord = require('discord.js');
const client = new Discord.Client();
var oldTitle = ''
var newTitle = ''
var oldLink = ''
var newLink = ''
var currentChannel;

client.login(process.env.TOKEN);

const r = new snoowrap({
    userAgent: 'gamedealsDiscordBot',
    clientId: '_RiNfMMa8z1k6w',
    clientSecret: 'BEI2MgxKWjuHJoGk-EDFqIJNyMA',
    refreshToken: '472092989087-TmlQ_dVvaxF7xS6i8uh3DLxQZiM'
});

client.on('ready', () => {
    console.info(`logged in as ${bot.user.tag}!`);
    bot.user.setActivity('!start', {
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
    if (oldTitle == newTitle) {
        setTimeout(main, 300000)
    } else {
        oldTitle = newTitle
        oldLink = newLink
        currentChannel.send(oldTitle + ' ' + oldLink);
        setTimeout(main, 300000)
    }
}

function main() {
    asyncFunc(syncFunc);
}

function asyncFunc(callback) {
    r.getSubreddit('gamedeals').getNew({ limit: 0 }).then(posts => {
        posts.map(submission => {
            newTitle = submission.title
            newLink = submission.url
        })
        return callback();
    })
}