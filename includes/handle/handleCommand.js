module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const stringSimilarity = require('string-similarity'),
      escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      logger = require("../../utils/log.js");
    const axios = require('axios')
    const moment = require("moment-timezone");
  let fs = require('fs')
    return async function ({ event }) {
      const dateNow = Date.now()
      const time = moment.tz("Asia/Ho_Chi_minh").format("HH:MM:ss - DD/MM/YYYY");
      const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode, allspadmOnly, keySpadmOnly, adminOnly, spadmPaseOnly } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;
    var { body, senderID, threadID, messageID } = event;
    var senderID = String(senderID),
      threadID = String(threadID);
    const threadSetting = threadData.get(threadID) || {}
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)})\\s*`);
    if (!prefixRegex.test(body)) return;
    const adminbot = require('./../../config.json');
    let callback_unsend_mid = (err, res = {})=>setTimeout(()=>api.unsendMessage(res.messageID),1000*4);
if(!global.data.allThreadID.includes(threadID) && !ADMINBOT.includes(senderID) && adminbot.spadmPaseOnly == true) {
  return api.sendMessage("[ 𝗠𝗢𝗗𝗘 ] → Hiện tại đang kích hoạt chế độ chỉ ADMIN mới được sử dụng Bot trong chat riêng", threadID, callback_unsend_mid, messageID)
}    
    if (!ADMINBOT.includes(senderID) && adminbot.allspadmOnly == true) {
  return api.sendMessage('[ 𝗠𝗢𝗗𝗘 ] → Hiện tại đang kích hoạt chế độ vô cực cho tất cả các nhóm, chỉ ADMIN được sử dụng Bot', threadID, callback_unsend_mid, messageID)
    }
    if (!NDH.includes(senderID) && !ADMINBOT.includes(senderID) && adminbot.alladmOnly == true) { 
          return api.sendMessage('[ 𝗠𝗢𝗗𝗘 ] → Hiện tại đang kích hoạt chế độ người thuê bot cho tất cả các nhóm, chỉ người thuê bot được sử dụng Bot', threadID, callback_unsend_mid, messageID)
    }
    const dataAdbox = require('./../../modules/commands/cache/data.json');
    var threadInf = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
const findd = threadInf.adminIDs.find(el => el.id == senderID);
   if (dataAdbox.adminbox.hasOwnProperty(threadID) && dataAdbox.adminbox[threadID] == true && !ADMINBOT.includes(senderID) && !findd && event.isGroup == true && !NDH.includes(senderID) && !findd && event.isGroup == true) return api.sendMessage('[ 𝗠𝗢𝗗𝗘 ] → Hiện tại đang kích hoạt chế độ Quản trị viên cho nhóm này, chỉ Quản trị viên nhóm được sử dụng Bot', event.threadID, callback_unsend_mid, event.messageID)
    if(dataAdbox.spadmonly[threadID] == true && !ADMINBOT.includes(senderID) == true) {
  return api.sendMessage('[ 𝗠𝗢𝗗𝗘 ] → Hiện tại đang kích hoạt chế độ vô cực cho nhóm này, thành viên nhóm này không được sử dụng Bot', threadID, callback_unsend_mid, messageID)
    }
    if(dataAdbox.admonly[threadID] == true && !ADMINBOT.includes(senderID) && !NDH.includes(senderID) == true) {
  return api.sendMessage('[ 𝗠𝗢𝗗𝗘 ] → Hiện tại đang kích hoạt chế độ người thuê bot cho nhóm này, thành viên nhóm này không được sử dụng Bot', threadID, callback_unsend_mid, messageID)
    }
      if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == ![] && senderID == threadID) {
        if (!ADMINBOT.includes(senderID.toString())) {
          if (userBanned.has(senderID)) {
            const { reason, dateAdded } = userBanned.get(senderID) || {};
            return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          } else {
            const [matchedPrefix] = body.match(prefixRegex),
 args = body.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            if (threadBanned.has(threadID) && commandName != "callad") {
           const {
 reason,
 dateAdded
 } = threadBanned.get(threadID) || {};
          return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
         await new Promise(resolve => setTimeout(resolve, 9999 * 1000));
         return api.unsendMessage(info.messageID);
 }, messageID);
 }
 }
 }
 }
      const [matchedPrefix] = body.match(prefixRegex),
        args = body.slice(matchedPrefix.length).trim().split(/ +/);
      commandName = args.shift().toLowerCase();
      var command = commands.get(commandName);
      if (!command) {
        var allCommandName = [];
        const commandValues = commands['keys']();
        for (const cmd of commandValues) allCommandName.push(cmd)
        const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
        if (checker.bestMatch.rating >= 0.5) command = client.commands.get(checker.bestMatch.target);
        else return api.sendMessage(global.getText("handleCommand", "commandNotExist", checker.bestMatch.target), threadID);
      }
      if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
        if (!ADMINBOT.includes(senderID)) {
          const banThreads = commandBanned.get(threadID) || [],
            banUsers = commandBanned.get(senderID) || [];
          if (banThreads.includes(command.config.name))
            return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000))
              return api.unsendMessage(info.messageID);
            }, messageID);
          if (banUsers.includes(command.config.name))
            return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
        }
      }
      let path_disable_cmd_category = __dirname+'/../../modules/commands/cache/disable-command-category.dcn.json';
let data_disable_cmd_category = {};
let cmd_category = (command.config).commandCategory;

if (!!fs.existsSync(path_disable_cmd_category))data_disable_cmd_category = JSON.parse(fs.readFileSync(path_disable_cmd_category));
if (!data_disable_cmd_category[threadID])data_disable_cmd_category[threadID] = [];
if ((!ADMINBOT.includes(senderID) && !findd)&& data_disable_cmd_category[threadID][cmd_category] == true)return api.sendMessage(`⚠ Nhóm không được quản trị viên cấp phép sử dụng nhóm lệnh ${cmd_category}.`, threadID);
      if (command.config.commandCategory.toLowerCase() == 'nsfw' && !global.data.threadAllowNSFW.includes(threadID) && !ADMINBOT.includes(senderID))
        return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), threadID, async (err, info) => {
  
          await new Promise(resolve => setTimeout(resolve, 5 * 1000))
          return api.unsendMessage(info.messageID);
        }, messageID);
      var threadInfo2;
      if (event.isGroup == false)
        try {
          threadInfo2 = (threadInfo.get(threadID) || await Threads.getInfo(threadID))
          if (Object.keys(threadInfo2).length == 0) throw new Error();
        } catch (err) {
          logger(global.getText("handleCommand", "cantGetInfoThread", "error"));
        }
      var permssion = 0;
      var threadInfoo = await Threads.getInfo(threadID);
      var thrin = threadInfoo.adminIDs != undefined && threadInfoo.adminIDs != null ? threadInfoo.adminIDs : threadInfoo.adminIDs = [];
      const find = thrin.find(el => el.id == senderID);
      if (NDH.includes(senderID.toString())) permssion = 2;
      if (ADMINBOT.includes(senderID.toString())) permssion = 3;
      else if (!ADMINBOT.includes(senderID) && !NDH.includes(senderID) && find) permssion = 1;
      var quyenhan = ""
    if (command.config.hasPermssion == 1 ){
      quyenhan = "quản trị viên nhóm"
    } else if (command.config.hasPermssion == 2 ) {
      quyenhan = "người thuê bot mới sử dụng được nhé =))"
    } else if(command.config.hasPermssion == 3) {
      quyenhan = "Admin bot =))"
    }
    if (command.config.hasPermssion > permssion) return api.sendMessage(`[ 𝗠𝗢𝗗𝗘 ] → Lệnh ${command.config.name} chỉ được dùng với những người có quyền hạn là ${quyenhan}`, event.threadID, event.messageID);       
         if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
          const timestamps = client.cooldowns.get(command.config.name);;
          const expirationTime = (command.config.cooldowns || 1) * 0;
          if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) 
        return api.sendMessage("⏱ Bạn đang trong thời gian chờ!\n vui lòng thử lại sau", threadID, messageID);
  
      var getText2;
      if (command.languages && typeof command.languages == 'object' && command.languages.hasOwnProperty(global.config.language))
        getText2 = (...values) => {
          var lang = command.languages[global.config.language][values[0]] || '';
          for (var i = values.length; i > 0x2533 + 0x1105 + -0x3638; i--) {
            const expReg = RegExp('%' + i, 'g');
            lang = lang.replace(expReg, values[i]);
          }
          return lang;
        };
      else getText2 = () => { };
      try {
        const Obj = {};
        Obj.api = api
        Obj.event = event
        Obj.args = args
        Obj.models = models
        Obj.Users = Users
        Obj.Threads = Threads
        Obj.Currencies = Currencies
        Obj.permssion = permssion
        Obj.getText = getText2
        command.run(Obj);
        timestamps.set(senderID, dateNow);
        if (DeveloperMode == !![])
          logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow), "[ DEV MODE ]");
        return;
      } catch (e) {
        return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
      }
    };
  };