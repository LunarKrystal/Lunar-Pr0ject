module.exports.config = {
  name: 'autosend',
  version: '10.02',
  hasPermssion: 2,
  credits: 'Kz',
  description: 'Tự động gửi tin nhắn !',
  commandCategory: 'Hệ thống',
  usages: '[]',
  cooldowns: 3
};
const r = a => a[Math.floor(Math.random()*a.length)],
{
  get
} = require('axios'),
config = [{
      timer: '00:10:00 AM',
      message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
        {
      timer: '6:00:00 AM',
  message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
{
      timer: '8:00:00 AM',
      message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
{
      timer: '10:06:00 AM',
   message : [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
{
  timer: '12:00:00 AM',
  message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
{
      timer: '3:00:00 PM',
      message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
{ 
      timer: '4:00:00 PM',
      message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
{ 
      timer: '6:00:00 PM',
      message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
{
      timer: '8:00:00 PM',
      message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
},
{
      timer: '00:08:00 PM',
      message: [`[ 🔥 ] • 𝐓𝐢𝐧 𝐧𝐡ắ𝐧 𝐭ự độ𝐧𝐠\n▱▱▱▱▱▱▱▱\n➝ 𝐁𝐚̂𝐲 𝐆𝐢𝐨̛̀ 𝐋𝐚̀ ${time}\n➝ 𝐒ử 𝐝ụ𝐧𝐠 𝐯𝐮𝐢 𝐯ẻ`]
  }];
  const rdPathName = Math.floor(Math.random() * 99999999999999);
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss | DD/MM/YYYY");
  module.exports.handleReply = async function({ api, args, event, handleReply, Users }) {
     // var name = (await Users.getData(event.senderID)).name;
      let { body, threadID, senderID, messageID } = event;
      var text = `BoxID: ${handleReply.boxid}  Tin Nhắn ${body} || Time: ${time}`
      const axios = require('axios');
          const fs = require('fs-extra')
     if(handleReply.type == 'sendtoadmin'){
      if (event.attachments.length != 0) {
          if (event.attachments[0].type == "audio") {
          var path = __dirname + `/sendmsg/${rdPathName}.m4a` ||  __dirname + `/sendmsg/${rdPathName}.mp3`
          }
          if (event.attachments[0].type == "photo") {
          var path = __dirname + `/sendmsg/${rdPathName}.jpg`
          }
          if (event.attachments[0].type == "video") {
          var path = __dirname + `/sendmsg/${rdPathName}.mp4`
          }
          if (event.attachments[0].type == "animated_image") {
          var path = __dirname + `/sendmsg/${rdPathName}.gif`
          }
        let getdata = (await axios.get(`${event.attachments[0].url}`, {
            responseType: 'arraybuffer'
          })).data
          fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'))
          var formsend = {
            body: `${text}`,
            attachment: fs.createReadStream(path) 
          }
     } else {
      var formsend = {
          body: `${text}`
        }
     }
     var idad = global.config.ADMINBOT;
     for (let ad of idad) {
      api.sendMessage(fromsend, threadID, (error, info) => {       
          if (error) { console.log(error) } else
            global.client.handleReply.push({
              name: this.config.name,
              messageID: info.messageID,
              boxid: handleReply.boxid,
              messID: messageID,
              type: "sendtouser"
            })
          })
     }   
}
if(handleReply.type == "sendtouser"){
  if (event.attachments.length != 0) {
      if (event.attachments[0].type == "audio") {
      var path = __dirname + `/sendmsg/${rdPathName}.m4a` ||  __dirname + `/sendmsg/${rdPathName}.mp3`
      }
      if (event.attachments[0].type == "photo") {
      var path = __dirname + `/sendmsg/${rdPathName}.jpg`
      }
      if (event.attachments[0].type == "video") {
      var path = __dirname + `/sendmsg/${rdPathName}.mp4`
      }
      if (event.attachments[0].type == "animated_image") {
      var path = __dirname + `/sendmsg/${rdPathName}.gif`
      }
    let getdata = (await axios.get(`${event.attachments[0].url}`, {
        responseType: 'arraybuffer'
      })).data
      fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'))
      var formsend = {
        body: `${text}`,
        attachment: fs.createReadStream(path) 
      }
 } else {
  var formsend = {
      body: `${text}`
    }
 }
 var idad = global.config.ADMINBOT;
 for (let ad of idad) {
  api.sendMessage(fromsend, threadID, (error, info) => {       
      if (error) { console.log(error) } else
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          boxid: handleReply.boxid,
          messID: messageID,
          type: "sendtoadmin"
        })
      })
 } 
}
}
module.exports.onLoad = o => {
  if (!!global.autosendmessage_setinterval) clearInterval(global.autosendmessage_setinterval);
  global.autosendmessage_setinterval = setInterval(async function() {
      if (á = config.find(i => i.timer == new Date(Date.now()+25200000).toLocaleString().split(/,/).pop().trim())) {
          var msg = r(á.message);
          msg = msg.replace(/{time}/g, (require("moment-timezone")).tz("Asia/Ho_Chi_Minh").format("HH:mm:ss (D/MM/YYYY) (dddd)")).replace(/{thinh}/g, (await get(`https://API-RYO.ducryovn.repl.co/api/hearing.php`)).data.data)
          msg = {
              body: msg, attachment: (await get((await get(`https://duongkum999.tech/cos/`)).data.data, {
                  responseType: 'stream'
              })).data
          };
          global.data.allThreadID.forEach(i => o.api.sendMessage(msg, i, (error, info) => {       
              if (error) { console.log(error) } else
                global.client.handleReply.push({
                  name: this.config.name,
                  messageID: info.messageID,
                  boxid: i,
                  messID: messageID,
                  type: "sendtoadmin"
                })
              }));
      };
  }, 1000);
};
module.exports.run = () => {};