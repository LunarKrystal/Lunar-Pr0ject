const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

module.exports.config = {
  name: "menu",
  usePrefix: true,
  version: "6.0.0",
  hasPermssion: 0,
  credits: "Tiến",
  description: "Hiển thị danh sách lệnh hoặc thông tin chi tiết về lệnh",
  commandCategory: "Tiện ích",
  usages: "menu [tên lệnh | danh mục | all]",
  cooldowns: 5
};


const createCommandImage = (textLines) => {
  const canvas = createCanvas(800, textLines.length * 30 + 20);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#000000';
  ctx.font = '20px Arial';
  let y = 30;
  textLines.forEach(line => {
    ctx.fillText(line, 20, y);
    y += 30;
  });

  return canvas.toBuffer('image/png');
};

module.exports.run = async function({ api, event, args, Users }) {
  const commandsPath = path.resolve(__dirname, '..', 'commands');
  const senderID = event.senderID;
  const userPermission = (await Users.getData(senderID)).data.permission || 0;

  try {
    const files = await fs.promises.readdir(commandsPath);
    let commandFiles = files.filter(file => file.endsWith('.js'));

    if (commandFiles.length === 0) {
      return api.sendMessage("Không có lệnh nào trong thư mục commands.", event.threadID, event.messageID);
    }

   
    commandFiles = await Promise.all(commandFiles.map(async file => {
      try {
        const command = require(path.join(commandsPath, file));
        const stats = await fs.promises.stat(path.join(commandsPath, file));
        return {
          name: file.replace('.js', ''),
          config: command.config,
          lastUpdated: stats.mtime
        };
      } catch {
        return {
          name: file.replace('.js', ''),
          config: {
            description: 'Lỗi tải lệnh',
            credits: 'Không rõ',
            version: 'Không rõ',
            usages: 'Không rõ',
            cooldowns: 0,
            hasPermssion: 0,
            commandCategory: 'Khác'
          },
          lastUpdated: null
        };
      }
    }));

    commandFiles = commandFiles.filter(cmd => userPermission >= cmd.config.hasPermssion);

    if (args.length === 0) {
      let categorizedCommands = {};
      commandFiles.forEach((cmd, idx) => {
        const category = cmd.config.commandCategory || 'Khác';
        if (!categorizedCommands[category]) categorizedCommands[category] = [];
        categorizedCommands[category].push({ ...cmd, index: idx + 1 });
      });

      let menuText = "Danh mục lệnh:\n\n";
      Object.keys(categorizedCommands).forEach((category, idx) => {
        menuText += `${idx + 1}. ${category}: ${categorizedCommands[category].length} lệnh\n`;
      });

      menuText += "\nTrả lời tin nhắn với số thứ tự hoặc tên danh mục để xem chi tiết, hoặc gõ 'all' để xem tất cả lệnh.";

      const textLines = menuText.split('\n');
      const buffer = createCommandImage(textLines);
      fs.writeFileSync(path.resolve(__dirname, 'menu.png'), buffer);

      return api.sendMessage({ body: "Danh mục lệnh:", attachment: fs.createReadStream(path.resolve(__dirname, 'menu.png')) }, event.threadID, (err, info) => {
        if (err) return console.error(err);
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          categorizedCommands: categorizedCommands
        });
      });

    } else {
      const input = args.join(" ").toLowerCase();

      if (input === 'all') {
        let allCommandsText = "Tất cả các lệnh:\n\n";
        commandFiles.forEach((cmd, idx) => {
          allCommandsText += `${idx + 1}. ${cmd.name}: ${cmd.config.description || 'Không có mô tả'}\n`;
        });

        const textLines = allCommandsText.split('\n');
        const chunks = [];
        const chunkSize = 20;

        for (let i = 0; i < textLines.length; i += chunkSize) {
          chunks.push(textLines.slice(i, i + chunkSize));
        }

        const attachments = [];
        chunks.forEach((chunk, idx) => {
          const buffer = createCommandImage(chunk);
          const filePath = path.resolve(__dirname, `allCommands_${idx + 1}.png`);
          fs.writeFileSync(filePath, buffer);
          attachments.push(fs.createReadStream(filePath));
        });

        return api.sendMessage({ body: "Tất cả các lệnh:", attachment: attachments }, event.threadID, (err, info) => {
          if (err) return console.error(err);
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            commandsList: commandFiles
          });
        });
      }

      const command = commandFiles.find(cmd => cmd.name.toLowerCase() === input);

      if (command) {
        let detailedInfo = `Thông tin lệnh ${command.name}:\n\n`;
        detailedInfo += `- Mô tả: ${command.config.description || 'Không có mô tả'}\n`;
        detailedInfo += `- Tác giả: ${command.config.credits || 'Không rõ'}\n`;
        detailedInfo += `- Phiên bản: ${command.config.version || 'Không rõ'}\n`;
        detailedInfo += `- Cách dùng: ${command.config.usages || 'Không có thông tin'}\n`;
        detailedInfo += `- Thời gian hồi: ${command.config.cooldowns || '0'} giây\n`;
        detailedInfo += `- Cập nhật lần cuối: ${command.lastUpdated ? command.lastUpdated.toLocaleString() : 'Không rõ'}\n`;

        const textLines = detailedInfo.split('\n');
        const buffer = createCommandImage(textLines);
        fs.writeFileSync(path.resolve(__dirname, `${command.name}.png`), buffer);

        return api.sendMessage({ body: `Thông tin lệnh ${command.name}:`, attachment: fs.createReadStream(path.resolve(__dirname, `${command.name}.png`)) }, event.threadID, event.messageID);
      }

      const categoryCommands = commandFiles.filter(cmd => cmd.config.commandCategory && cmd.config.commandCategory.toLowerCase() === input);

      if (categoryCommands.length === 0) {
        return api.sendMessage("Không tìm thấy lệnh hoặc danh mục.", event.threadID, event.messageID);
      }

      let commandsListText = `Các lệnh trong danh mục ${input}:\n\n`;
      categoryCommands.forEach((cmd, idx) => {
        commandsListText += `${idx + 1}. ${cmd.name}: ${cmd.config.description || 'Không có mô tả'}\n`;
      });

      const textLines = commandsListText.split('\n');
      const chunks = [];
      const chunkSize = 20;

      for (let i = 0; i < textLines.length; i += chunkSize) {
        chunks.push(textLines.slice(i, i + chunkSize));
      }

      const attachments = [];
      chunks.forEach((chunk, idx) => {
        const buffer = createCommandImage(chunk);
        const filePath = path.resolve(__dirname, `categoryCommands_${input}_${idx + 1}.png`);
        fs.writeFileSync(filePath, buffer);
        attachments.push(fs.createReadStream(filePath));
      });

      return api.sendMessage({ body: `Các lệnh trong danh mục ${input}:`, attachment: attachments }, event.threadID, event.messageID);
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage("Đã xảy ra lỗi khi xử lý lệnh", event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const { threadID, messageID, senderID, body } = event;

  if (handleReply.author !== senderID) return;

  const input = body.trim();
  const index = parseInt(input);


  let categoryName = input.toLowerCase();
  let categoryCommands = null;
  

  if (!isNaN(index)) {
    if (handleReply.commandsList && index > 0 && index <= handleReply.commandsList.length) {
      const command = handleReply.commandsList[index - 1];

      
      let detailedInfo = `Thông tin lệnh ${command.name}:\n\n`;
      detailedInfo += `- Mô tả: ${command.config.description || 'Không có mô tả'}\n`;
      detailedInfo += `- Tác giả: ${command.config.credits || 'Không rõ'}\n`;
      detailedInfo += `- Phiên bản: ${command.config.version || 'Không rõ'}\n`;
      detailedInfo += `- Cách dùng: ${command.config.usages || 'Không rõ'}\n`;
      detailedInfo += `- Thời gian hồi: ${command.config.cooldowns || '0'} giây\n`;
      detailedInfo += `- Cập nhật lần cuối: ${command.lastUpdated ? command.lastUpdated.toLocaleString() : 'Không rõ'}\n`;

      const textLines = detailedInfo.split('\n');
      const buffer = createCommandImage(textLines);
      fs.writeFileSync(path.resolve(__dirname, `${command.name}.png`), buffer);

      return api.sendMessage({
        body: `Thông tin lệnh ${command.name}:`,
        attachment: fs.createReadStream(path.resolve(__dirname, `${command.name}.png`))
      }, threadID, messageID);
    } else if (index > 0 && index <= Object.keys(handleReply.categorizedCommands).length) {
      categoryName = Object.keys(handleReply.categorizedCommands)[index - 1].toLowerCase();
    }
  }

 
  for (const [key, value] of Object.entries(handleReply.categorizedCommands)) {
    if (key.toLowerCase() === categoryName) {
      categoryCommands = value;
      break;
    }
  }

  if (categoryCommands) {
    let commandsListText = `Các lệnh trong danh mục ${categoryName}:\n\n`;
    categoryCommands.forEach((cmd, idx) => {
      commandsListText += `${idx + 1}. ${cmd.name}: ${cmd.config.description || 'Không có mô tả'}\n`;
    });

    const textLines = commandsListText.split('\n');
    const chunks = [];
    const chunkSize = 20;

    for (let i = 0; i < textLines.length; i += chunkSize) {
      chunks.push(textLines.slice(i, i + chunkSize));
    }

    const attachments = [];
    chunks.forEach((chunk, idx) => {
      const buffer = createCommandImage(chunk);
      const filePath = path.resolve(__dirname, `categoryCommands_${categoryName}_${idx + 1}.png`);
      fs.writeFileSync(filePath, buffer);
      attachments.push(fs.createReadStream(filePath));
    });

    return api.sendMessage({
      body: `Các lệnh trong danh mục ${categoryName}:`,
      attachment: attachments
    }, threadID, messageID);
  }

  return api.sendMessage("Không tìm thấy danh mục hoặc lệnh nào.", threadID, messageID);
};
