const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "dỗi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Vdang",
  description: "lệnh vô tri vailon",
  commandCategory: "Giải trí",
  usages: "[tag]",
  cooldowns: 5,
  usePrefix: false,  // Thêm dòng này để sử dụng prefix là false
};

module.exports.run = async ({ api, event, Threads, global }) => {
  var link = [
    "https://i.imgur.com/v95lf3g.png",
    "https://i.imgur.com/nufRpBi.png",
    "https://i.imgur.com/9l6IW77.png",
    "https://i.imgur.com/dJrWOv6.png",
    "https://i.imgur.com/4YRwuLa.png"
  ];
  var mention = Object.keys(event.mentions);
  let tag = event.mentions[mention].replace("@", "");
  
  if (!mention) return api.sendMessage("Vui lòng tag 1 người", event.threadID, event.messageID);
  
  var callback = () => 
    api.sendMessage({
      body: `Bé dỗi ${tag} rồi ToT`,
      mentions: [{ tag: tag, id: Object.keys(event.mentions)[0] }],
      attachment: fs.createReadStream(__dirname + "/cache/doi.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/doi.png"));
  
  return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/doi.png")).on("close", () => callback());
};
