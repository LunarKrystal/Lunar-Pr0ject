module.exports.config = {
    name: "chucmungsn",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "...",
    description: "Chúc mừng sinh nhật người bạn tag\nThể hiện sự quan tâm",
    commandCategory: "Gọi Hồn",
    usages: "chucmungsn @mention",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event}) {
    var mention = Object.keys(event.mentions)[0];
    if(!mention) return api.sendMessage("Cần phải tag 1 người bạn muốn chúc mừng", event.threadID);
 let name =  event.mentions[mention];
    var arraytag = [];
        arraytag.push({id: mention, tag: name});
    var a = function (a) { api.sendMessage(a, event.threadID); }
a("1 2 3......Happy Birthday 🎁");
setTimeout(() => {a({body: "Mừng Ngày Sinh Một Đoá Hoa" + " " + name, mentions: arraytag})}, 3000);
setTimeout(() => {a({body: "Mừng Ngày Sinh Một Khúc Ca" + " " + name, mentions: arraytag})}, 5000);
setTimeout(() => {a({body: "Mừng Ngày Đã Sinh Cho Cuộc Đời" + " " + name, mentions: arraytag})}, 7000);
setTimeout(() => {a({body: "Một Bông Hoa Tươi Rực Rỡ" + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {a({body: "Cuộc Đời Em Là Đoá Hoa" + " " + name, mentions: arraytag})}, 12000);
setTimeout(() => {a({body: "Cuộc Đời Em Là Khúc Ca" + " " + name, mentions: arraytag})}, 15000);
setTimeout(() => {a({body: "Cuộc Đời Sẽ Thêm Tươi Đẹp" + " " + name, mentions: arraytag})}, 17000);
setTimeout(() => {a({body: "Những Đoá Hoa Và Khúc Ca" + " " + name, mentions: arraytag})}, 20000);
setTimeout(() => {a({body: "Chúc Bé Iuz Sinh Nhật Vui Vẻ" + " " + name, mentions: arraytag})}, 23000);
setTimeout(() => {a({body: "Tuổi Mới Xinh Đẹp Hơn" + " " + name, mentions: arraytag})}, 25000);
setTimeout(() => {a({body: "Gặp Được Nhiều Hạnh Phúc Và May Mắn Trong Cuộc Sống" + " " + name, mentions: arraytag})}, 28500);
setTimeout(() => {a({body: "Happy Birthdayy 🎂" + " " + name, mentions: arraytag})}, 31000);
setTimeout(() => {a({body: "I LOVE YOU SO MUCH 💝" + " " + name, mentions: arraytag})}, 36000);



  
  }