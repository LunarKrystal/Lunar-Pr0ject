module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "lemon",
  description: "Xem prefix của BOT",
  commandCategory: "Thành Viên",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var os = require("os");
	var cpus = os.cpus();
	var chips;
	for (var i of cpus) chips = i.model, speed = i.speed;
	if (cpus == undefined);
  var { threadID, messageID, body, senderID } = event;
  //if (senderID == global.data.botID) return;
  if ((this.config.credits) != "lemon") { return api.sendMessage(`Sửa credits con mẹ mày à ?`, threadID, messageID)}
  function out(data) {
    api.sendMessage(data, threadID, messageID)
  }
  var dataThread = (await Threads.getData(threadID));
  var data = dataThread.data; 
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};

  var arr = ["prefix","dùng kiểu gì","prefix là gì", "dấu lệnh", "dùng như nào","pre", "dùng sao"];
  arr.forEach(i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() | body === i | str === body) {
		const prefix = threadSetting.PREFIX || global.config.PREFIX;
      if (data.PREFIX == null) {
        return out(`┏━━━━━━━━━━━━━━━━━━━━┓\n┣➤ Prefix hệ thống: [ ${prefix} ]\n┣➤ Bạn có thể xài prefix [ ${prefix} ] với nhóm hiện tại.\n┗━━━━━━━━━━━━━━━━━━━━┛\n`)
      }
      else return out('┏━━━━━━━━━━━━━━━━━━━━┓\n┣➤ Prefix hiện tại của nhóm: [ ' + data.PREFIX + ' ]\n┣➤ Prefix mặc định của hệ thống: [ ' + prefix + ` ]\n┗━━━━━━━━━━━━━━━━━━━━┛\n`)
    }

  });
};

module.exports.run = async({ event, api }) => {
    return api.sendMessage("biết prefix r còn nhắn cái đéo j =))", event.threadID)
}