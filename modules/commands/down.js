function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports.config = {
  name: 'down',
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Quất",
  description: "tải link",
  commandCategory: "Admin",
  usages: "/down + link",
  usePrefix: false,
  cooldowns: 0,
};

const axios = require("axios");

module.exports.run = async function({ api, event, args }) {
  const i = (url) => axios.get(url, { responseType: "stream" }).then((r) => r.data);

  let links;
  if (event.type == 'message_reply') {
    links = event.messageReply.body.split('\n');
  } else {
    links = args.join(' ').split('\n');
  }

  const validLinks = [];
  const invalidLinks = [];
  const audioLinks = [];
  const videoLinks = [];
  const mediaLinks = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (!isValidUrl(link)) {
      invalidLinks.push(i + 1);
    } else {
      validLinks.push(link);

      if (link.endsWith('.mp3')) {
    audioLinks.push(link);
} else if (link.endsWith('.mp4')) {
    videoLinks.push(link);
} else if (link.endsWith('.gif') || link.endsWith('.jpg') || link.endsWith('.jpeg') || link.endsWith('.png')) {
    mediaLinks.push(link);
} else {
    invalidLinks.push(i + 1);
}
    }
  }

  if (invalidLinks.length > 0) {
    const errorMessage = `Link thứ ${invalidLinks.join(', ')} không đúng định dạng. Đang loại bỏ...`;
    api.sendMessage({ body: errorMessage, attachment: [] }, event.threadID);
    links = links.filter((_, index) => !invalidLinks.includes(index + 1));
  }

  const audioAttachments = await Promise.all(audioLinks.map(async link => await i(link)));
  const videoAttachments = await Promise.all(videoLinks.map(async link => await i(link)));
  const mediaAttachments = await Promise.all(mediaLinks.map(async link => await i(link)));
  const successfulDownloads = audioAttachments.filter(Boolean).length + videoAttachments.filter(Boolean).length + mediaAttachments.filter(Boolean).length;

  api.sendMessage({
    body: `Đang tải ${successfulDownloads} link...`,
    attachment: []
  }, event.threadID);

  if (audioAttachments.length > 0) {
    for (const audioAttachment of audioAttachments) {
      api.sendMessage({
        body: `Đã tải thành công 1 âm thanh`,
        attachment: [audioAttachment]
      }, event.threadID);
    }
  }

  if (videoAttachments.length > 0) {
    for (const videoAttachment of videoAttachments) {
      api.sendMessage({
        body: `Đã tải thành công 1 video.`,
        attachment: [videoAttachment]
      }, event.threadID);
    }
  }

  if (mediaAttachments.length > 0) {
    let mediaMessage = `Đã tải thành công ${mediaAttachments.length} ảnh và gif`;
    api.sendMessage({
      body: mediaMessage,
      attachment: mediaAttachments
    }, event.threadID);
  }
}