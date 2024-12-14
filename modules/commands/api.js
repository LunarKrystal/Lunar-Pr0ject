const fs = require("fs");
const path = require("path");
const axios = require("axios");

const pathApi = path.join(__dirname, "../../datajson/");

module.exports.config = {
  name: "api",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Vtuan",
  description: "no",
  commandCategory: "Admin",
  usages: "[]",
  cooldowns: 1,
};

const CL = (filePath) =>
  fs.readFileSync(filePath, "utf-8").split(/\r\n|\r|\n/).length;

module.exports.run = async function ({ api, event, args }) {
  try {
    if (args.length > 0) {
      const subCommand = args[0].toLowerCase();

      if (subCommand === "add") {
        api.setMessageReaction("⌛", event.messageID, () => { }, true);
        let msg = "";
        const replyMessage = event.messageReply;
        let fileName = "api.json";

        if (!replyMessage) {
          return api.sendMessage(
            `Vui lòng reply ảnh hoặc video + tên file api hoặc để trống để lưu vào file ${fileName}`,
            event.threadID,
          );
        }
        if (args.length > 1) {
          fileName = args.slice(1).join("_") + ".json";
        }
        const filePath = pathApi + fileName;

        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, "[]", "utf-8");
        }

        for (let i of replyMessage.attachments) {
          await axios
            .get(
              `https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(
                i.url
              )}`
            )
            .then(async ($) => {
              msg += `${$.data.url}\n`;
            });
           //api.sendMessage('✅Thêm thành công',event.threadID)

        }

        let existingData = [];

        try {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          existingData = JSON.parse(fileContent);
        } catch (error) {
          console.error("Error reading JSON file:", error);
        }

        existingData = existingData.concat(msg.split("\n").filter(Boolean));

        fs.writeFileSync(
          filePath,
          JSON.stringify(existingData, null, 2),
          "utf-8"
        );
        api.setMessageReaction("✅", event.messageID, () => { }, true);

        return api.sendMessage("✅Thêm thành công", event.threadID);
      } else if (subCommand === "cr") {
        if (args.length === 1) {
          api.setMessageReaction("❎", event.messageID, () => { }, true);
          return api.sendMessage(
            `➣ Bạn cần nhập tên file để tạo!`,
            event.threadID
          );
        }

        let fileName = args.slice(1).join("_") + ".json";
        const filePath = pathApi + fileName;

        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, "[]", "utf-8");
          api.setMessageReaction("✅", event.messageID, () => { }, true);
          return api.sendMessage(`➣ Đã tạo file ${fileName}`, event.threadID);
        } else {
          return api.sendMessage(
            `➣ File ${fileName} đã tồn tại`,
            event.threadID
          );
        }
      } else if (subCommand === "rm") {
        if (args.length === 1) {
          api.setMessageReaction("❎", event.messageID, () => { }, true);
          return api.sendMessage(
            `➣ Bạn cần nhập tên file để xóa!`,
            event.threadID
          );
        }

        let fileName = args.slice(1).join("_") + ".json";
        const filePath = pathApi + fileName;

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          api.setMessageReaction("✅", event.messageID, () => { }, true);
          return api.sendMessage(`➣ Đã xóa file ${fileName}`, event.threadID);
        } else {
          api.setMessageReaction("❎", event.messageID, () => { }, true);
          return api.sendMessage(
            `➣ File ${fileName}.json không tồn tại`,
            event.threadID
          );
        }
      } else if (subCommand === "gf") {
        if (args.length === 1) {
          api.setMessageReaction("❎", event.messageID, () => { }, true);
          return api.sendMessage(
            `➣ Bạn cần nhập tên file để share!`,
            event.threadID
          );
      }

        const fileName = args[1].toLowerCase() + ".json";
        const filePath = pathApi + fileName;
        if (fs.existsSync(filePath)) {
          try {
            const fileContent = fs.readFileSync(filePath, "utf-8");

            const response = await axios.post(
              "https://api.mocky.io/api/mock",
              {
                status: 200,
                content: fileContent,
                content_type: "application/json",
                charset: "UTF-8",
                secret: "NguyenMinhHuy",
                expiration: "never",
              }
            );
            api.setMessageReaction("✅", event.messageID, () => { }, true);
            return api.sendMessage(
              `➣ ${fileName}: ${response.data.link}`,
              event.threadID
            );
          } catch (error) {
            console.error(`Error processing file ${fileName}:`, error);
            api.setMessageReaction("❎", event.messageID, () => { }, true);
            return api.sendMessage(
              `Đã xảy ra lỗi trong quá trình xử lý file ${fileName}`,
              event.threadID
            );
          }
        } else {
          api.setMessageReaction("❎", event.messageID, () => { }, true);
          console.error(`File ${fileName} không tồn tại`);
          return api.sendMessage(
            `➣ File ${fileName} không tồn tại`,
            event.threadID
          );
        }
      } else if (subCommand === "check") {
        if (args.length < 2) {
          const files = fs.readdirSync(pathApi);
          const jsonFiles = files.filter(
            (file) => path.extname(file).toLowerCase() === ".json"
          );

          if (jsonFiles.length > 0) {
            const fileListArray = jsonFiles.map((file, index) => ({
              index: index + 1,
              fileName: path.basename(file, ".json"),
              filePath: pathApi + file,
              lineCount: CL(pathApi + file),
            }));

            const fileList = fileListArray
              .map(
                (item) =>
                  `${item.index}. ${item.fileName} (${item.lineCount} lines)`
              )
              .join("\n");
              api.setMessageReaction("✅", event.messageID, () => { }, true);
            const messageInfo = await api.sendMessage(
              `➣ Danh sách các link api:\n${fileList}\n\nReply tin nhắn này: rm/cr/gf/check + stt`,
              event.threadID
            );

            const replyInfo = {
              name: module.exports.config.name,
              messageID: messageInfo.messageID,
              author: event.senderID,
              fileListArray,
              type: "list",
            };
            global.client.handleReply.push(replyInfo);

            return;
          } else {
            return api.sendMessage(`➣ Thư mục rỗng`, event.threadID);
          }
        } /*else {

          if (args[1].toLowerCase() === "all") { 
            console.log(`abcxyz`)
          }

          const fileName = args[1].toLowerCase() + ".json";
          const filePath = pathApi + fileName;

          if (!fs.existsSync(filePath))
            return api.sendMessage(
              `File ${fileName} không tồn tại!`,
              event.threadID
            );
          try {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const jsonData = JSON.parse(fileContent);

            const brokenLinks = await Promise.all(
              jsonData.map(async (link) => {
                try {
                  const response = await axios.head(link);
                  if (response.status === 404) return link;
                } catch (error) {
                  //console.error(`Error checking link ${link}:`);
                  return link;
                }
              })
            );

            const linkk = brokenLinks.filter(Boolean);
            const sốlinkdie = linkk.length;
            let msg = ``;
            if (sốlinkdie === 0) {
              msg += `⪼ Không có link die`;
            } else {
              msg += `<Check Link>\n➣ link die: ${sốlinkdie}\n➣ link sống: ${
                jsonData.length - sốlinkdie
              }\n➣ Thả cảm xúc bất kì vào tin nhắn này để xóa link die`;
            }
            return api.sendMessage(msg, event.threadID, (error, info) => {
              if (error) {
                console.error(error);
              } else {
                global.client.handleReaction.push({
                  name: module.exports.config.name,
                  messageID: info.messageID,
                  author: event.senderID,
                  type: "check",
                  linkk,
                  filePath,
                });
              }
            });
          } catch (error) {
            // console.error(`Error checking links in file ${fileName}:`, error);
            return api.sendMessage(
              `Đã xảy ra lỗi trong quá trình kiểm tra liên kết trong file ${fileName}`,
              event.threadID
            );
          }*/
        }
      }


    else {
      const files = fs.readdirSync(pathApi);
      const jsonFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".json"
      );
      const tong = jsonFiles.length;
      let tsdong = 0;
      for (const file of jsonFiles) {
        const filePath = pathApi + file;
        tsdong += CL(filePath);
      }
      api.setMessageReaction("✅", event.messageID, () => { }, true);
      const cachsudung = `
━━━━━━━━━━┓
┏━━━━━━━━━━━━━━━━━      
┃➢ check: xem toàn bộ danh 
┃                sách api
┃
┃➣ check + tên file muốn 
┃                kiểm tra
┃
┃➣ rm + tên file json 
┃                muốn xóa
┃
┃➣ cr + tên file json để
┃                 tạo file mới
┃
┃➣ gf + tên file để share 
┃           file api
┃
┃➣ add:reply ảnh/video
┃      audio muốn làm api!
┃   ➛ add + tên file cụ thể
┃   ➛ add + để trống 
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛                `;

      return api.sendMessage(
        `
${cachsudung}
➣ Tổng số file api hiện có: ${tong}
➣ Tổng số dòng: ${tsdong}
➣ Reply tin nhắn này: cr + tên file để tạo file json mới`,
        event.threadID,
        async (error, info) => {
          if (error) {
            console.error(error);
          } else {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "api",
            });
          }
        }
      );
    }
  } catch (error) {
    console.error("Error in run function:", error);
    api.setMessageReaction("❎", event.messageID, () => { }, true);
    return api.sendMessage(
      "Đã xảy ra lỗi trong quá trình xử lý!",
      event.threadID
    );
  }
};
module.exports.handleReply = async ({ api, handleReply, event }) => {
  try {
    const { threadID, body, messageID } = event;
    const { fileListArray, type } = handleReply;
    const args = body.split(" ");

    const getPath = (fileName) => pathApi + fileName + ".json";

    const NVNH = (message) => api.sendMessage(message, threadID);

    if (type === "list") {
      if (args[0].toLowerCase() === "rm") {
        const fileIndices = args.slice(1).map((index) => parseInt(index));

        for (const fileIndex of fileIndices) {
          if (fileIndex >= 1 && fileIndex <= fileListArray.length) {
            const selectedFile = fileListArray[fileIndex - 1];
            const filePath = getPath(selectedFile.fileName);

            fs.unlink(filePath, (err) => {
              if (err) console.error(`Error deleting file ${filePath}:`, err);
            });
            api.setMessageReaction("✅", event.messageID, () => { }, true);
            NVNH(`Đã xóa file ${selectedFile.fileName}`);
          } else {
            api.setMessageReaction("❎", event.messageID, () => { }, true);
            NVNH(`Tên ${fileIndex} không hợp lệ`);
          }
        }
      } else if (args[0].toLowerCase() === "cr") {
        if (args.length === 1) {
          api.setMessageReaction("❎", event.messageID, () => { }, true);
          return NVNH(`➣ Bạn cần nhập tên file để tạo!`);
        }

        let fileName = args.slice(1).join("_") + ".json";
        const filePath = getPath(fileName);

        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, "[]", "utf-8");
          api.setMessageReaction("✅", event.messageID, () => { }, true);
          NVNH(`Đã tạo file ${fileName}`);
        } else {
          api.setMessageReaction("❎", event.messageID, () => { }, true);
          NVNH(`File ${fileName} đã tồn tại`);
        }
      } else if (args[0].toLowerCase() === "gf") {
        const fileIndices = args.slice(1).map((index) => parseInt(index));

        for (const fileIndex of fileIndices) {
          if (fileIndex >= 1 && fileIndex <= fileListArray.length) {
            const selectedFile = fileListArray[fileIndex - 1];
            const filePath = getPath(selectedFile.fileName);

            try {
              const fileContent = fs.readFileSync(filePath, "utf-8");
              const response = await axios.post(
                "https://api.mocky.io/api/mock",
                {
                  status: 200,
                  content: fileContent,
                  content_type: "application/json",
                  charset: "UTF-8",
                  secret: "NguyenMinhHuy",
                  expiration: "never",
                },
              );

              const mockyLink = response.data.link;
              console.log(mockyLink);
              api.setMessageReaction("✅", event.messageID, () => { }, true);
              NVNH(`➣ ${selectedFile.fileName}: ${mockyLink}`);
            } catch (error) {
              console.error(
                "Error posting file content to RunMocky or processing response:",
                error,
              );
              api.setMessageReaction("❎", event.messageID, () => { }, true);
              NVNH("Đã xảy ra lỗi trong quá trình xử lý!");
            }
          } else {
            api.setMessageReaction("❎", event.messageID, () => { }, true);
            NVNH(`Tên file ${fileIndex} không có `);
          }
        }
      } else if (args[0].toLowerCase() === "check") {
        const fileIndices = args.slice(1).map((index) => parseInt(index));

        for (const fileIndex of fileIndices) {
          if (fileIndex >= 1 && fileIndex <= fileListArray.length) {
            const selectedFile = fileListArray[fileIndex - 1];
            const filePath = getPath(selectedFile.fileName);
            api.setMessageReaction("⌛", event.messageID, () => { }, true);
            try {
              const fileContent = fs.readFileSync(filePath, "utf-8");
              const jsonData = JSON.parse(fileContent);

              const brokenLinks = await Promise.all(
                jsonData.map(async (link) => {
                  try {
                    const response = await axios.head(link);
                    if (response.status === 404) {
                      return link;
                    }
                  } catch (error) {
                    //console.error(`Error checking link ${link}:`, error);
                    return link;
                  }
                }),
              );

              const nn = brokenLinks.filter(Boolean).length;
              // const numberOfLiveLinks = jsonData.length - nn;
              /*const message = `Tệp ${selectedFile.fileName} chứa:\n` +
                    `- Số liên kết die: ${nn}\n` +
                    `- Số liên kết còn sống: ${numberOfLiveLinks}`;*/
                    api.setMessageReaction("✅", event.messageID, () => { }, true);
              const message = `===𝐂𝐡𝐞𝐜𝐤 𝐋𝐢𝐧𝐤===\n➣ 𝐋𝐢𝐧𝐤 𝐝𝐢𝐞: ${nn}\n➣ 𝐋𝐢𝐧𝐤 𝐬𝐨̂́𝐧𝐠: ${jsonData.length - nn}\n➣ Thả cảm xúc bất kì vào tin nhắn này để xóa link die`;
              api.sendMessage(message, event.threadID, (error, info) => {
                if (error) {
                  console.error(error);
                } else {
                  global.client.handleReaction.push({
                    name: module.exports.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    type: "check",
                    linkk: brokenLinks,
                    filePath,
                  });
                }
              });
            } catch (error) {
              console.error(
                `Error reading or parsing JSON file ${selectedFile.fileName}:`,
                error,
              );
              api.setMessageReaction("❎", event.messageID, () => { }, true);
              api.sendMessage(
                `Đã xảy ra lỗi khi đọc hoặc phân tích tệp JSON ${selectedFile.fileName}`,
                event.threadID,
              );
            }
          } else {
            api.setMessageReaction("❎", event.messageID, () => { }, true);
            NVNH(`Index ${fileIndex} không hợp lệ`);
          }
        }
      }
    } else if (type === "api" && args[0].toLowerCase() === "cr") {
      if (args.length === 1) {
        api.setMessageReaction("❎", event.messageID, () => { }, true);
        return NVNH(`➣ Bạn cần nhập tên file để tạo!`);
      }

      let fileName = args.slice(1).join("_") + ".json";
      const filePath = getPath(fileName);

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]", "utf-8");
        api.setMessageReaction("✅", event.messageID, () => { }, true);
        NVNH(`✅ Đã tạo file ${fileName}`);
      } else {
        api.setMessageReaction("❎", event.messageID, () => { }, true);
        NVNH(`➣ File ${fileName} đã tồn tại`);
      }
    }
  } catch (error) {
    console.error("Lỗi: ", error);
  }
};
module.exports.handleReaction = async function ({
  api,
  event,
  handleReaction,
}) {
  if (event.userID != handleReaction.author) return;
  try {
    const { filePath, linkk } = handleReaction;

    if (filePath && Array.isArray(linkk) && linkk.length > 0) {
      let fileContent = fs.readFileSync(filePath, "utf-8");
      let jsonData = JSON.parse(fileContent);
      const l = jsonData.length;
      jsonData = jsonData.filter((link) => !linkk.includes(link));
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

      const d = l - jsonData.length;

      api.sendMessage(`✅ Đã xóa thành công ${d} link die`, event.threadID);
    }
  } catch (error) {
    console.error("Error handling reaction:", error);
  }
};