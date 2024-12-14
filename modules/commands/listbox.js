module.exports.config = {
  name: 'listbox',
  version: '1.0.0',
  credits: 'manhIT',//Mod by Q.Huy
  hasPermssion: 2,
  description: 'Danh sách nhóm Bot đã tham gia',
  commandCategory: 'Admin',
  usages: '< >',
  cooldowns: 15
};


module.exports.handleReply = async function({ api, event, args, Threads, handleReply }) {

  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  var arg = event.body.split(" ");
  var idgr = handleReply.groupid[arg[1] - 1];


  switch (handleReply.type) {

    case "reply":
      {
        if (arg[0] == "ban" || arg[0] == "Ban") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 1;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.set(parseInt(idgr), 1);
          api.sendMessage(`[ 𝗠𝗢𝗗𝗘 ] →  Đã ban thành công nhóm\n→ TID: ${idgr}`, event.threadID, event.messageID);
          break;
          }
        
          if (arg[0] == "unban" || arg[0] == "Unban") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 1;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.delete(parseInt(idgr), 1);
          api.sendMessage(`[ 𝗠𝗢𝗗𝗘 ] →  Đã gỡ ban thành công cho nhóm\n→ TID: ${idgr}`, event.threadID, event.messageID);
          break;
        }

        if (arg[0] == "out" || arg[0] == "Out") {
          api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);
          api.sendMessage("[ 𝗠𝗢𝗗𝗘 ] → Đã out nhóm có ID: " + idgr + "\n" + (await Threads.getData(idgr)).name, event.threadID, event.messageID);
          break;
        }

      }
  }
};


module.exports.run = async function({ api, event, client }) {
  var inbox = await api.getThreadList(100, null, ['INBOX']);
  let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);

  var listthread = [];

  //////////


  for (var groupInfo of list) {
    let data = (await api.getThreadInfo(groupInfo.threadID));

    listthread.push({
      id: groupInfo.threadID,
      name: groupInfo.name,
      sotv: data.userInfo.length,
      qtv: data.adminIDs.length, 
      messageCount: groupInfo.messageCount,
    });

  } //for

  var listbox = listthread.sort((a, b) => {
    if (a.sotv > b.sotv) return -1;
    if (a.sotv < b.sotv) return 1;
  });

  let msg = '==== [ Danh Sách Nhóm ] ====\n──────────────────\n',
    i = 1;
  var groupid = [];
  for (var group of listbox) {
    msg += `${i++}. ${group.name}\n→ ID: ${group.id}\n→ Số thành viên: ${group.sotv}\n→ Số quản trị viên: ${group.qtv}\n→ Tổng số tin nhắn: ${group.messageCount}\n──────────────────\n`;
    groupid.push(group.id);
  }

  api.sendMessage(msg + '→ Phản hồi < out/ban/unban + số thứ tự > để out hoặc ban và unban nhóm tương ứng', event.threadID, (e, data) =>
    global.client.handleReply.push({
      name: this.config.name,
      author: event.senderID,
      messageID: data.messageID,
      groupid,
      type: 'reply'
    })
  );
};