const axios = require('axios');

exports.config = {
  name: 'checksdt',
  usePrefix: false,
  version: '1.0.0',
  hasPermssion: 0,
  credits: 'bu',
  description: 'Kiểm tra số điện thoại',
  commandCategory: 'Nhóm',
  usages: 'checksdt <số điện thoại>',
  cooldowns: 5
};

exports.run = async function({ api, event, args }) {
  const apiKey = '796ab2a4eac24dd8b133a9e49a9a3ecd';
  let phoneNumber = args.join(' ').trim(); 

  if (!phoneNumber) {
    return api.sendMessage('Vui lòng cung cấp số điện thoại.', event.threadID, event.messageID);
  }

  
  phoneNumber = phoneNumber.replace(/[^+\d]/g, '');

 
  if (!phoneNumber.startsWith('+')) {
    return api.sendMessage('Vui lòng cung cấp số điện thoại theo định dạng quốc tế (bao gồm dấu "+").', event.threadID, event.messageID);
  }

  const url = `https://phonevalidation.abstractapi.com/v1/?api_key=${apiKey}&phone=${phoneNumber}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.valid) {
      let resultMessage = `Thông tin số điện thoại ${phoneNumber}:\n`;
      resultMessage += `- Quốc gia: ${data.country ? data.country.name : 'Không xác định'}\n`;
      resultMessage += `- Nhà mạng: ${data.carrier ? data.carrier : 'Không xác định'}\n`;
      resultMessage += `- Loại điện thoại: ${data.type ? data.type : 'Không xác định'}\n`;
      resultMessage += `- Vị trí: ${data.location ? data.location : 'Không xác định'}\n`;
      resultMessage += `- Định dạng quốc tế: ${data.format ? data.format.international : 'Không xác định'}\n`;
      resultMessage += `- Định dạng nội địa: ${data.format ? data.format.local : 'Không xác định'}\n`;

      api.sendMessage(resultMessage, event.threadID, event.messageID);
    } else {
      api.sendMessage(`Số điện thoại ${phoneNumber} không hợp lệ.`, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error fetching phone validation data:', error);
    api.sendMessage('Có lỗi xảy ra khi kiểm tra số điện thoại. Vui lòng thử lại sau.', event.threadID, event.messageID);
  }
};
