exports.config = {
  name: 'imgur',
  version: '0.0.1',
  hasPermssion: 0,
  credits: 'DC-Nam',
  description: 'upload photo/video to imgur.com',
  commandCategory: 'Tiện ích',
  usages: '[reply photo/video]',
  cooldowns: 3
};
exports.run = async(o)=> {
  let send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);

  let result = [];
  for (let url of(o.event.messageReply?.attachments || o.args))try {
    result.push((await require('axios').get('https://imgu.dcnam.repl.co/?'+url.url || url)).data)}catch {};

  send(JSON.stringify(result, 0, 4));
};