this.config = {
    name: 'checkweb',
    version: '0.0.1',
    hasPermission: 0,
    credits: 'HuyKaiser- NamDC',
    description: '',
    commandCategory: 'Tiện ích',
    usages: '.checkweb [domain]',
    cooldowns: 3,
    usePrefix: false
};

let axios = require('axios');
let cheerio = require('cheerio');

this.run = function (o) {
    let send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);

    if (!o.args[0]) {
        return send("⚠️ Bạn phải nhập tên miền để kiểm tra");
    }

    axios.get('https://scam.vn/check-website?domain=' + encodeURIComponent(o.args[0]))
        .then(res => {
            let dom = cheerio.load(res.data);
            let div = dom('.container.text-center');
            let date_register = div.find('div:eq(0) > div:eq(0) > h6').text().split(' ').pop();
            let [like, dis_like] = ['#improve_web', '#report_web'].map($ => div.find(`${$} > span`).text());
            let do_tin_cay = div.find('.col-md-12.bg-warning.p-3 > a').text();
            let warn = [0, 1].map($ => div.find('.col-md-6.mt-2').eq($).text().trim());

            send(`📌 Tên Miền: ${o.args[0]}\n📆 Ngày Đăng Ký: ${date_register || 'N/A'}\n👍 Lượt Thích: ${like || '0'}\n👎 Lượt Không Thích: ${dis_like || '0'}\n🧠 Độ Tin Cậy: ${do_tin_cay || 'N/A'}\n\n🌟 Điểm Tích Cực Nổi Bật:\n${warn[0] || 'Không có'}\n\n⚠️ Điểm Tiêu Cực Nổi Bật:\n${warn[1] || 'Không có'}`);
        })
        .catch(err => send(`❌ Đã xảy ra lỗi: ${err.toString()}`));
};
