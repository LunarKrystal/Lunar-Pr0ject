 module.exports.config = {
  name: "tag",
  version: "1.0.0",
  hasPermssion: 3,
  credits: "",
  description: "",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 1
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100018277053087") {
    var aid = ["100018277053087"];   ///// điền uid fb mày vào
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["Admin đang bận !",`Dùng ${config.PREFIX}callad + nội dung cần gửi!`,"Vui lòng chờ đợi Admin trả lời, cấm spam !"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
}