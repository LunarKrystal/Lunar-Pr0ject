const axios = require('axios');
const isURL = u => /^http(|s):\/\//.test(u);
exports.handleEvent = async function(o) {
    try {
        const str = o.event.body;
        const send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
        const head = app => `==『 AUTODOWN ${app.toUpperCase()} 』==\n────────────────`;
        let streamURL = (url, ext = 'jpg') => require('axios').get(url, { responseType: 'stream', }).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);
        if (/capcut\.com/.test(str)) {
            const res = await axios.get(`https://api-dongdev.onrender.com/capcut/dl?apikey=DongDev_Vip_sb3utCn&url=${str}`);
            const data = res.data;
            const title = data.title || "Không có tiêu đề";
            const description = data.description || "Không có mô tả";
            const usage = data.usage || "Không có thông tin lượt xem";
            const link = data.video || "";         
            if (link) {
                const attachment = await streamURL(link, 'mp4');
                send({ body: `${head('CAPCUT')}\n→ Tiêu Đề: ${title}\n→ Description : ${description}\n→ Lượt Xem : ${usage}`, attachment });
            } else {
                send("Không tìm thấy video.");
            }
        }
    } catch(e) {
        console.log('Error', e);
        send("Đã xảy ra lỗi khi xử lý yêu cầu.");
    }
};
exports.run = () => {};
exports.config = {
    name: 'autodowncc',
    version: '1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: '',
    commandCategory: 'Tiện ích',
    usages: [],
    cooldowns: 1
};