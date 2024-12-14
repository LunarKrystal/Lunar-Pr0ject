module.exports.config = {
    name: "taixiu",
    version: "0.0.1",
    hasPermssion: 0,
    credits: "WhoisHakira stolen form lorenBot(MinhHuyDev)",
    description: "Chơi tài xỉu",
    commandCategory: "Game",
    usages: "taixiu [tài/xỉu] [số tiền]",
    cooldowns: 0
};
const axios = require('axios');
var bdsd = true;
var tilethang = 2.53;
var tilethangb3dn = 10;
var tilethangb2dn = 5;
var timedelay = 2;
var haisogiong = 2;
var basogiong = 3;
var motsogiong = 1;
function replace(int){
    var str = int.toString();
    var newstr = str.replace(/(.)(?=(\d{3})+$)/g,'$1,');
    return newstr;
}
function getImage(number){
    switch (number){
case 1: return "https://i.imgur.com/cmdORaJ.jpg";
case 2: return "https://i.imgur.com/WNFbw4O.jpg";
case 3: return "https://i.imgur.com/Xo6xIX2.jpg";
case 4: return "https://i.imgur.com/NJJjlRK.jpg";
case 5: return "https://i.imgur.com/QLixtBe.jpg";
case 6: return "https://i.imgur.com/y8gyJYG.jpg";
    }
}
function getRATE(tong){
    if(tong == 4) var rate = 40;
    if(tong == 5) var rate = 35;
    if(tong == 6) var rate = 33.33;
    if(tong == 7) var rate = 25;
    if(tong == 8) var rate = 20;
    if(tong == 9) var rate = 16.66;
    if(tong == 10) var rate = 14.28;
    if(tong == 11) var rate = 12.5;
    if(tong == 12) var rate = 11.11;
    if(tong == 13) var rate = 10;
    if(tong == 14) var rate = 9.09;
    if(tong == 15) var rate = 8.33;
    if(tong == 16) var rate = 7.69;
    if(tong == 17) var rate = 7.14;
    return rate
}
module.exports.run = async function ({ event, api, Currencies, Users, args }) {
    try{
    const moment = require("moment-timezone");
    const format_day = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm:ss");
    const { increaseMoney , decreaseMoney } = Currencies;
    const { threadID, messageID, senderID } = event;
    const { sendMessage: HakiraSEND } = api;
    var name = await Users.getNameUser(senderID)
    var money = (await Currencies.getData(senderID)).money
    var bet = parseInt((args[1] == "allin" ? money : args[1]));
    var input = args[0];
    var tong = parseInt(args[2])
    if(!input) return HakiraSEND("===〘 𝐓𝐚̀𝐢 𝐗𝐢̉𝐮 〙===\n◈ 𝐒𝐚𝐢 𝐂𝐚́𝐜𝐡 𝐒𝐮̛̉ 𝐃𝐮̣𝐧𝐠 𝐑𝐨̂̀𝐢 𝐂𝐚̣̂𝐮 𝐎̛𝐢:𝟑\n⋄ 𝐇𝐮̛𝐨̛́𝐧𝐠 𝐃𝐚̂̃𝐧 𝐒𝐮̛̉ 𝐃𝐮̣𝐧𝐠 !!!\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐭𝐚̀𝐢 𝐨𝐫 𝐱𝐢̉𝐮\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐛𝟑𝐠𝐧\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐛𝟐𝐠𝐧\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐜𝐮𝐨𝐜𝐭𝐨𝐧𝐠\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐜𝐮𝐨𝐜𝐬𝐨\n⋄ 𝐕𝐚̂̃𝐧 𝐊𝐡𝐨̂𝐧𝐠 𝐇𝐢𝐞̂̉𝐮 𝐓𝐡𝐢̀ 𝐊𝐡𝐨̉𝐢 𝐒𝐚̀𝐢 𝐍𝐡𝐞́ 𝐂𝐚̣̂𝐮 𝐎̛𝐢 🙂", threadID, messageID);
    if(!bet) return HakiraSEND("◈ 𝐁𝐚̣𝐧 𝐍𝐠𝐡𝐢̃ 𝐁𝐚̣𝐧 𝐋𝐚̀ 𝐀𝐢 ?", threadID, messageID);
    if(bet < 20) return HakiraSEND("◈ 𝐒𝐨̂́ 𝐓𝐢𝐞̂̀𝐧 𝐓𝐨̂́𝐢 𝐓𝐡𝐢𝐞̂̉𝐮 𝐂𝐡𝐨 𝐌𝐢𝐧𝐢 𝐆𝐚𝐦𝐞 𝐍𝐚̀𝐲 𝐋𝐚̀ 𝟐𝟎$", threadID, messageID);
    if(bet > money) return HakiraSEND("◈ 𝐍𝐡𝐚̂𝐧 𝐕𝐢𝐞̂𝐧 𝐐𝐮𝐞̀𝐧 𝐍𝐡𝐮̛ 𝐂𝐨̂ 𝐂𝐮̃𝐧𝐠 𝐂𝐨́ 𝐓𝐢𝐞̂̀𝐧 𝐂𝐡𝐨̛𝐢 𝐓𝐫𝐨̀ 𝐍𝐚̀𝐲 𝐒𝐚𝐨 ? 𝐂𝐮́𝐭 𝐕𝐞̂̀ 𝐋𝐚̀𝐦 𝐂𝐚𝐯𝐞 𝐌𝐚̀ 𝐊𝐢𝐞̂́𝐦 𝐒𝐨̂́𝐧𝐠 𝐇𝐚𝐡𝐚𝐡𝐚𝐡𝐚𝐡𝐚𝐡𝐚𝐡𝐚𝐡𝐚", threadID, messageID);
    if(input == "tài" || input == "Tài" || input == '-t') var choose = 'tài'
    if(input == "xỉu" || input == "Xỉu" || input == '-x') var choose = 'xỉu'
    if(input == 'b3gn' || input == 'bbgn' || input == 'btgn') var choose = 'b3gn'
    if(input == 'b2gn' || input == 'bdgn' || input == 'bhgn') var choose = 'b2gn'
    if(input == 'cuoctong' || input == 'ct') var choose = 'cuoctong'
    if(input == 'cuocso' || input == 'cs') var choose = 'cuocso'
    var tag = ['tài','xỉu','b3gn','b2gn','cuoctong','cuocso']
    if(!tag.includes(choose)) return HakiraSEND('=== 𝐓𝐚̀𝐢 𝐗𝐢̉𝐮 ===\n◈ 𝐒𝐚𝐢 𝐂𝐚́𝐜𝐡 𝐒𝐮̛̉ 𝐃𝐮̣𝐧𝐠 𝐑𝐨̂̀𝐢 𝐂𝐚̣̂𝐮 𝐎̛𝐢:𝟑\n⋄ 𝐇𝐮̛𝐨̛́𝐧𝐠 𝐃𝐚̂̃𝐧 𝐒𝐮̛̉ 𝐃𝐮̣𝐧𝐠 !!!\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐭𝐚̀𝐢 𝐨𝐫 𝐱𝐢̉𝐮\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐛𝟑𝐠𝐧\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐛𝟐𝐠𝐧\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐜𝐮𝐨𝐜𝐭𝐨𝐧𝐠\n→ 𝐭𝐚𝐢𝐱𝐢𝐮 𝐜𝐮𝐨𝐜𝐬𝐨\n⋄ 𝐕𝐚̂̃𝐧 𝐊𝐡𝐨̂𝐧𝐠 𝐇𝐢𝐞̂̉𝐮 𝐓𝐡𝐢̀ 𝐊𝐡𝐨̉𝐢 𝐒𝐚̀𝐢 𝐍𝐡𝐞́ 𝐂𝐚̣̂𝐮 𝐎̛𝐢 🙂', threadID, messageID)
    if(choose == 'cuoctong' && (tong < 4 || tong > 17)) return HakiraSEND("◈ 𝐓𝐨̂̉𝐧𝐠 𝐂𝐮̛𝐨̛̣𝐜 𝐊𝐡𝐨̂𝐧𝐠 𝐇𝐨̛̣𝐩 𝐋𝐞̣̂ 🚫\n◈ 𝐐𝐮𝐲́ 𝐊𝐡𝐚́𝐜𝐡 𝐓𝐡𝐚̂𝐧 𝐌𝐞̂́𝐧 𝐇𝐚̃𝐲 𝐒𝐮̛̉ 𝐃𝐮̣𝐧𝐠 𝐂𝐨𝐧 𝐒𝐨̂́ 𝐊𝐡𝐚́𝐜 𝐍𝐞̂́𝐮 𝐌𝐮𝐨̂́𝐧 𝐓𝐡𝐚𝐦 𝐆𝐢𝐚 !!", threadID, messageID);
    if(choose == 'cuocso' && (tong < 1 || tong > 6)) return HakiraSEND("◈ 𝐒𝐨̂́ 𝐐𝐮𝐲́ 𝐊𝐡𝐚́𝐜𝐡 𝐂𝐮̛𝐨̛̣𝐜 𝐊𝐡𝐨̂𝐧𝐠 𝐇𝐨̛̣𝐩 𝐋𝐞̣̂ 🚫\n◈ 𝐐𝐮𝐲́ 𝐊𝐡𝐚́𝐜𝐡 𝐓𝐡𝐚̂𝐧 𝐌𝐞̂́𝐧 𝐇𝐚̃𝐲 𝐒𝐮̛̉ 𝐃𝐮̣𝐧𝐠 𝐂𝐨𝐧 𝐒𝐨̂́ 𝐊𝐡𝐚́𝐜 𝐍𝐞̂́𝐮 𝐌𝐮𝐨̂́𝐧 𝐓𝐡𝐚𝐦 𝐆𝐢𝐚 !!", threadID, messageID);
    const number = [], img = [], bodem = 0;
    for(let i = 1; i < 4; i++){
    var n = Math.floor(Math.random() * 6 + 1) 
    number.push(n)
    var img_ = (await axios.get(encodeURI(getImage(n)), { responseType: 'stream' })).data;
    img.push(img_)
    HakiraSEND(`=== 𝐓𝐚̀𝐢 𝐗𝐢̉𝐮 ===\n→ 𝐍𝐠𝐮̛𝐨̛̀𝐢 𝐂𝐡𝐨̛𝐢: ${name}\n→ 𝐋𝐨𝐚̣𝐢 𝐆𝐚𝐦𝐞: ${choose}\n→ 𝐗𝐮́𝐜 𝐗𝐚́𝐜 𝐋𝐚̂̀𝐧 𝐓𝐡𝐮̛́ ${i}:〘 ${n} 〙`, threadID, messageID)
      await new Promise(resolve => setTimeout(resolve, timedelay * 1000))
}
var total = number[0] + number[1] + number[2];
if(choose == 'cuocso'){
    if(number[0] == tong || number[1] == tong || number[2] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * motsogiong 
        var mne = money + mn
    }
    if(number[1] == tong && number[2] == tong || number[0] == tong && number[2] == tong || number[0] == tong && number[1] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * haisogiong
        var mne = money + mn
    }
    if(number[0] == tong && number[1] == tong && number[2] == tong){
        var ans = `${tong}`
        var result = 'win'
        var mn = bet * basogiong
        var mne = money + mn
    }
    if(number[0] != tong && number[1] != tong && number[2] != tong){
        var ans = `${tong}`
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }   
}
if(choose == 'cuoctong'){
    if(total == tong){
        var ans = "cược tổng"
        var result = 'win'
        var mn = bet * parseInt((getRATE(tong)))
        var mne = money + mn
    } else {
        var ans = `${total}`
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'b3gn' ){
    if(number[0] == number[1] && number[1] == number[2]) {
        var ans = "bộ ba đồng nhất"
        var result = 'win'
        var mn = bet * tilethangb3dn
        var mne = money + mn
    } else {
        var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'b2gn'){
    if(number[0] == number[1] || number[1] == number[2] || number[0] == number[2]) {
        var ans = "bộ hai đồng nhất"
        var result = 'win'
        var mn = bet * tilethangb2dn
        var mne = money + mn
    } else {
        var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
        var result = 'lose'
        var mn = bet
        var mne = money - mn
    }
}
if(choose == 'tài' || choose == 'xỉu') {
if(number[0] == number[1] && number[1] == number[2]){
var ans = "bộ ba đồng nhất"
} else {
var ans = (total >= 11 && total <= 18 ? "tài" : "xỉu") 
}
if(number[0] == number[1] && number[1] == number[2]) {
    var result = 'lose'
    var mn = bet
    var mne = money - mn
}
if(ans == choose) {
    var result = 'win'
    var mn = bet * tilethang
    var mne = mn + money
} else {
    var result = 'lose'
    var mn = bet
    var mne = money - mn
}
}
if(result =='lose'){
    decreaseMoney(senderID, mn)
} else if(result == 'win'){
    increaseMoney(senderID, mn)
}
var msg =   `=== 𝐓𝐚̀𝐢 𝐗𝐢̉𝐮 ===\n⎔ 𝐊𝐞̂́𝐭 𝐐𝐮𝐚̉ 𝐓𝐫𝐨̀ 𝐂𝐡𝐨̛𝐢\n→ 𝐍𝐞̂́𝐮 𝐂𝐨́ 𝐋𝐨̂̃𝐢 𝐇𝐚̃𝐲 𝐁𝐚́𝐨 𝐐𝐮𝐚 𝐀𝐝𝐦𝐢𝐧 !!\n▭▭▭▭▭▭▭▭▭▭▭\n◈ 𝐓𝐢𝐦𝐞: ${format_day}\n◈ 𝐏𝐥𝐚𝐲𝐞𝐫: ${name}\n◈ 𝐋𝐨𝐚̣𝐢 𝐆𝐚𝐦𝐞: ${choose}\n◈ 𝐓𝐢𝐞̂̀𝐧 𝐂𝐮̛𝐨̛̣𝐜: ${replace(bet)}\n▭▭▭▭▭▭▭▭▭▭▭\n◈ 𝐗𝐮́𝐜 𝐗𝐚̆́𝐜 𝐋𝐚̂̀𝐧 𝟏: ${number[0]}\n◈ 𝐗𝐮́𝐜 𝐗𝐚̆́𝐜 𝐋𝐚̂̀𝐧 𝟐: ${number[1]}\n◈ 𝐗𝐮́𝐜 𝐗𝐚̆́𝐜 𝐋𝐚̂̀𝐧 𝟑: ${number[2]}\n▭▭▭▭▭▭▭▭▭▭▭\n➾ 𝐓𝐨̂̉𝐧𝐠 𝐏𝐨𝐢𝐧𝐭: ${total}\n➾ 𝐊𝐞̂́𝐭 𝐐𝐮𝐚̉: ${(result == 'win' ? 'Thắng' : 'Thua')}\n➾ 𝐌𝐨𝐧𝐞𝐲: ${(result == 'win' ? 'Thắng' : 'Thua')}: ${replace(Math.floor(mn))}$\n➾ 𝐒𝐨̂́ 𝐃𝐮̛: ${replace(mne)}$\n➾ 𝐓𝐫𝐚̣𝐧𝐠 𝐓𝐡𝐚́𝐢: ${(result == 'win' ? 'Đã Trả Thưởng' : 'Đã Trừ Tiền')}`
            HakiraSEND({body:msg,attachment: img}, threadID, messageID)
            if(bdsd == true) {
          var msg =  `=== Mirai Pay ===\nVào Ngày: ${format_day}\nSố Tài Khoản: 1373929273\nTrạng Thái: ${(result == 'win') ? 'nhận tiền' : 'trừ tiền'} Từ Game Tài Xỉu\nSố Tiền: ${replace(mn)}\nSố Dư Còn Lại: ${replace(mne)}$\nCảm Ơn Đã Tin Tưởng Và Sử Dụng Dịch Vụ MiraiPay Ở Bot Này Nhé Moah Moah ✨`
            HakiraSEND({
                body: msg,
               // attachment: img
            }, senderID)
        }
} catch(e){
    console.log(e)
}}
// dit me m