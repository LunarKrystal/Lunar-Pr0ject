const axios = require('axios');

module.exports.config = {
    name: "openai",
    version: "1.0.0",
    usePrefix: false,
    hasPermssion: 0,
    credits: "Hiếu",
    description: "Lấy thông tin từ API",
    commandCategory: "Tiện ích",
    usages: "[query]",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    if (args.length === 0) {
        return api.sendMessage("⚠️ Bạn phải nhập câu hỏi!", threadID, messageID);
    }

    const query = args.join(" ");
    const apiUrl = `https://tools.betabotz.eu.org/tools/openai?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.error) {
            return api.sendMessage(`⚠️ Không thể lấy thông tin từ API: ${data.error}`, threadID, messageID);
        }

        const { result } = data;
        const message = `📝 Kết quả từ API:\n${result}`;

        return api.sendMessage(message, threadID, (error, info) => {
            global.client.handleReply.push({
                type: "reply",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });
        }, messageID);
    } catch (error) {
        return api.sendMessage(`⚠️ Đã xảy ra lỗi khi gọi API: ${error.message}`, threadID, messageID);
    }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;

    if (handleReply.author !== senderID) {
        return api.sendMessage("⚠️ Bạn không có quyền tiếp tục cuộc hội thoại này.", threadID, messageID);
    }

    const query = body;
    const apiUrl = `https://tools.betabotz.eu.org/tools/openai?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.error) {
            return api.sendMessage(`⚠️ Không thể lấy thông tin từ API: ${data.error}`, threadID, messageID);
        }

        const { result } = data;
        const message = `📝 Kết quả từ API:\n${result}`;

        return api.sendMessage(message, threadID, (error, info) => {
            global.client.handleReply.push({
                type: "reply",
                name: this.config.name,
                author: senderID,
                messageID: info.messageID
            });
        }, messageID);
    } catch (error) {
        return api.sendMessage(`⚠️ Đã xảy ra lỗi khi gọi API: ${error.message}`, threadID, messageID);
    }
};
