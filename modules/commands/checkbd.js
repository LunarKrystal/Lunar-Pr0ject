exports.config = {
  name: 'checkbd',
  version: '1.0.0',
  hasPermssion: 0,
  usePrefix: false,
  credits: 'Mây Trắng',
  description: 'Kiểm tra thành viên chưa đặt biệt danh trong nhóm',
  commandCategory: 'Nhóm',
  usages: 'checknickname',
  cooldowns: 5
};

exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const nicknames = threadInfo.nicknames || {};
    const participantIDs = threadInfo.participantIDs || [];
    const noNicknameMembers = [];

    for (const userID of participantIDs) {
      const userInfo = await api.getUserInfo(userID);
      const userName = userInfo[userID].name;


      if (!nicknames[userID] || nicknames[userID].trim() === "") {
        noNicknameMembers.push(userName);
      }
    }


    if (noNicknameMembers.length === 0) {
      return api.sendMessage("Tất cả thành viên đều đã có biệt danh.", threadID, messageID);
    }

    let message = "📋 Danh sách các thành viên chưa có biệt danh:\n";
    noNicknameMembers.forEach((name, index) => {
      message += `${index + 1}. ${name}\n`;
    });

    return api.sendMessage(message, threadID, messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("Đã xảy ra lỗi khi kiểm tra biệt danh. Vui lòng thử lại sau.", threadID, messageID);
  }
};