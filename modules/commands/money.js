module.exports.config = {
  name: "money",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Quốc Anh", // mod vtuan
  description: "Kiểm tra số tiền của bản thân hoặc người được tag",
  commandCategory: "Quản Lí Tiền",
  usages: "[Tag]",
  cooldowns: 5,
  usePrefix: true
};

function replace(int) {
  var str = int.toString();
  var newstr = str.replace(/(.)(?=(\d{3})+$)/g, '$1,');
  return newstr;
}

module.exports.languages = {
  "vi": {
    "sotiennguoikhac": "Số dư trong tài khoản của bạn là: %2$"
  },
  "en": {
    "sotiennguoikhac": "Your account balance is: %2$."
  }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
  const { threadID, messageID, senderID, mentions } = event;

  // Kiểm tra số tiền của bản thân
  if (!args[0]) {
    const money = (await Currencies.getData(senderID)).money;
    return api.sendMessage(`Số dư trong tài khoản của bạn là: ${replace(money)}$`, threadID);
  }

  // Kiểm tra số tiền của người được tag
  else if (Object.keys(event.mentions).length == 1) {
    var mention = Object.keys(mentions)[0];
    var money = (await Currencies.getData(mention)).money;
    if (!money) money = 0;
    return api.sendMessage({
      body: getText("sotiennguoikhac", mentions[mention].replace(/\@/g, ""), replace(money)),
      mentions: [{
        tag: mentions[mention].replace(/\@/g, ""),
        id: mention
      }]
    }, threadID, messageID);
  }

  // Trường hợp sai hoặc lỗi
  else return global.utils.throwError(this.config.name, threadID, messageID);
};
