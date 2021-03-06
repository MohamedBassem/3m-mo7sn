Slack = require('slack-client');
http = require('http');

slackToken = process.env.SLACK_API_TOKEN

if(slackToken === undefined){
  console.error("SLACK_API_TOKEN env variable is not defined");
  process.exit(1);
}

autoReconnect = true
autoMark = true

slack = new Slack(slackToken, autoReconnect, autoMark);

slack.on("open", function(){
  console.log("Connected ...");
});


slack.on("message", function(message){
  handleMessage(message);
});

slack.on("error", function(err){
  console.error("ERROR : ", err);
});

slack.login();

function handleMessage(message){

  // Defining REGEXs
  DOOR_PLEASE_REGEX = /door (plz|please|pls)/i;
  HI_REGEX = new RegExp("hi <@" + slack.self.id + ">", "i");

  if(message.text === undefined){
    return;
  }else if(message.text.match(DOOR_PLEASE_REGEX)){
    handleDoorPleaseMessage(message);
  }else if(message.text.match(HI_REGEX)){
    handleHiMessage(message);
  }
}

function handleDoorPleaseMessage(message){
  user = slack.getUserByID(message.user);
  channel = slack.getChannelGroupOrDMByID(message.channel);
  messageText = message.text;

  http.get({
      host: '192.168.1.199',
      port: 8080,
      path: '/',
      method: 'GET'
  }, function(res) {
    channel.send("@" + user.name + " Done ya kbeer el m3lmeen :D");
  });
}


function handleHiMessage(message){

  RESPONSES = [ "Sba7 el gamal", "Sba7 el Fol" ]

  user = slack.getUserByID(message.user);
  channel = slack.getChannelGroupOrDMByID(message.channel);
  messageText = message.text;

  channel.send("@" + user.name + " " + RESPONSES[randomInt(0,RESPONSES.length)]);
}

function randomInt (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
