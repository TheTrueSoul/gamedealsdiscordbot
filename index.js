const snoowrap = require('snoowrap');
const http = require('http');
const port = process.env.PORT || 3000
const Discord = require('discord.js');
const client = new Discord.Client();

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Hello World</h1>');
  });
  
  server.listen(port,() => {
    console.log(`Server running at port `+port);
  });

const r = new snoowrap({
    userAgent: 'gamedealsDiscordBot',
    clientId: '_RiNfMMa8z1k6w',
    clientSecret: 'BEI2MgxKWjuHJoGk-EDFqIJNyMA',
    refreshToken: '472092989087-TmlQ_dVvaxF7xS6i8uh3DLxQZiM'
});

r.config({ continueAfterRatelimitError: true });
console.log('TESTING')
var currentChannel;

client.on('message', message => {
    if (message.content === '!start') {
        currentChannel = message.channel
        currentChannel.send('Starting Feed...');
        main()
    }
});

client.login('NjkyMTEyMjk5NzcwNzczNTQ1.XnpyMQ.iu6SvVz8qbHUsQZOSK0LLgdFTyQ');
var oldTitle = ''
var newTitle = ''
var oldLink = ''
var newLink = ''

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
    r.getSubreddit('gamedeals').getNew({ limit: 0 }).hide().then(posts => {
        posts.map(submission => {
            newTitle = submission.title
            newLink = submission.url
        })
        return callback();
    })
}