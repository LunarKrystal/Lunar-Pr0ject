exports.config = {
  name: 'checkkick',
  version: '1.0.0',
usePrefix: false,
  hasPermssion: 1,
  credits: 'Mây Trắng',
  description: 'Hiển thị danh sách các thành viên có số tin nhắn ít hơn số đã chỉ định và kick thành viên theo số thứ tự',
  commandCategory: 'Admin',
  usages: '@heckkick [số tin nhắn]',
  cooldowns: 5
};

const moment = require('moment-timezone');
const fs = require('fs');
const path = __dirname + '/tt/';

module.exports.onLoad = () => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
};

module.exports.handleEvent = async function({ api, event }) {
  try {
    if (!event.isGroup) return;

    const { threadID, senderID } = event;
    const today = moment.tz("Asia/Ho_Chi_Minh").day();

    if (!fs.existsSync(path + threadID + '.json')) {
      var newObj = {
        total: [],
        week: [],
        day: [],
        time: today,
        last: {
          time: today,
          day: [],
          week: [],
        },
      };
      fs.writeFileSync(path + threadID + '.json', JSON.stringify(newObj, null, 4));
    }

    var threadData = JSON.parse(fs.readFileSync(path + threadID + '.json'));

    if (threadData.time !== today) {
      threadData.day.forEach(e => e.count = 0);
      if (today === 1) {
        threadData.week.forEach(e => e.count = 0);
      }
      threadData.time = today;
    }

    const userIndexDay = threadData.day.findIndex(e => e.id === senderID);
    if (userIndexDay === -1) {
      threadData.day.push({ id: senderID, count: 1 });
    } else {
      threadData.day[userIndexDay].count++;
    }

    fs.writeFileSync(path + threadID + '.json', JSON.stringify(threadData, null, 4));
  } catch (e) {
    console.log(e);
  }
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  const path_data = path + threadID + '.json';
  if (!fs.existsSync(path_data)) {
    return api.sendMessage("Chưa có dữ liệu.", threadID);
  }

  const minMessages = parseInt(args[0]);
  if (isNaN(minMessages)) {
    return api.sendMessage("Vui lòng nhập số tin nhắn hợp lệ.", threadID, messageID);
  }

  const threadData = JSON.parse(fs.readFileSync(path_data));
  const userList = threadData.day.filter(user => user.count < minMessages);

  if (userList.length === 0) {
    return api.sendMessage("Không có thành viên nào trong danh sách.", threadID, messageID);
  }

  let message = "📋 Danh sách các thành viên có số tin nhắn ít hơn " + minMessages + ":\n";
  for (const [index, user] of userList.entries()) {
    const userInfo = await api.getUserInfo(user.id);
    const userName = userInfo[user.id].name;
    message += `${index + 1}. ${userName} (Tin nhắn: ${user.count})\n`;
  }

  api.sendMessage(message, threadID, (err, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      messageID: info.messageID,
      author: event.senderID,
      userList: userList
    });
  });
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;

  if (handleReply.author !== senderID) return;

  const index = parseInt(body) - 1;
  if (isNaN(index) || index < 0 || index >= handleReply.userList.length) {
    return api.sendMessage("Số thứ tự không hợp lệ.", threadID, messageID);
  }

  const userID = handleReply.userList[index].id;

  api.removeUserFromGroup(userID, threadID, (err) => {
    if (err) {
      return api.sendMessage(`Lỗi khi kick người dùng với ID ${userID}: ${err}`, threadID, messageID);
    } else {
      return api.sendMessage(`Đã kick thành viên với ID ${userID}.`, threadID, messageID);
    }
  });
};