const fs = require('fs');
const moment = require('moment-timezone');
const chalk = require('chalk');
const crypto = require('crypto');
const axios = require('axios');
const natural = require('natural');
const Sentiment = require('sentiment');
const TTS = require('google-tts-api');

module.exports.config = {
  name: "console",
  version: "3.0.0",
  hasPermssion: 3,
  credits: "Tiến",
  description: "console nâng cao với nhiều tính năng tiên tiến và thông minh",
  commandCategory: "Admin",
  usages: "console",
  cooldowns: 30
};
 
var isConsoleDisabled = false;
var num = 0;
var max = 25;
var timeStamp = 0;
var messageCount = 0;
var userMessageCount = {};
var groupMessageCount = {};
var errorCount = 0;
var alertStatus = false;
var reportInterval = 600000;
var spamThreshold = 50;
var aiWarningThreshold = 5;
var maintenanceMode = false;
var sentimentAnalyzer = new Sentiment();

function clearConsole() {
  setInterval(() => {
    console.clear();
    console.log("Console đã được làm mới");
  }, 60000);
}

function logToFile(data, fileName = 'console_log.txt') {
  fs.appendFileSync(fileName, `${data}\n`, 'utf8');
}

function disableConsole(cooldowns) {
  console.log(chalk.yellow(`Chế độ chống lag console đã được kích hoạt trong ${cooldowns}s`));
  isConsoleDisabled = true;
  setTimeout(() => {
    isConsoleDisabled = false;
    console.log(chalk.green("Chế độ chống lag đã tắt"));
  }, cooldowns * 1000);
}

function limitConsoleLines(maxLines = 100) {
  let lines = console.history || [];
  if (lines.length > maxLines) {
    console.clear();
    console.log("Console đã vượt quá số dòng giới hạn, xóa console...");
  }
}

function saveConsoleState() {
  setInterval(() => {
    const state = {
      time: moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"),
      messageCount,
      userMessageCount,
      groupMessageCount,
      errorCount
    };
    fs.writeFileSync('console_state.txt', JSON.stringify(state, null, 2), 'utf8');
    uploadStateToCloud(state);
    console.log("Trạng thái console đã được lưu và đồng bộ hóa với đám mây");
  }, reportInterval);
}

function uploadStateToCloud(state) {
  axios.post('https://api.your-cloud-service.com/upload', state)
    .then(response => console.log("Dữ liệu đã được lưu trữ trên đám mây thành công"))
    .catch(error => console.error("Lỗi khi lưu trữ dữ liệu lên đám mây:", error.message));
}

function detectSpam(senderID) {
  if (userMessageCount[senderID] > spamThreshold) {
    console.log(chalk.red(`Cảnh báo: Phát hiện spam từ người dùng ${senderID}`));
    logToFile(`Spam detected from user ${senderID}`, 'spam_log.txt');
    if (!alertStatus) {
      alertStatus = true;
      disableConsole(30);
    }
  }
}

function aiContentAnalysis(content) {
  const aiModel = new Set(["badword1", "badword2", "spamword"]);
  let warnings = 0;
  content.split(' ').forEach(word => {
    if (aiModel.has(word.toLowerCase())) warnings++;
  });
  return warnings;
}

function sentimentAnalysis(content) {
  const result = sentimentAnalyzer.analyze(content);
  console.log(chalk.magenta(`Phân tích cảm xúc: Điểm số ${result.score}, Tích cực: ${result.positive}, Tiêu cực: ${result.negative}`));
  return result;
}

function createFrame(type, threadName, senderName, messageBody) {
  const borderLength = 40;
  const formatLine = (label, value, color) => {
    const line = `${label}: ${value}`;
    return `║ ${chalk[color](line.padEnd(borderLength - 4))} ║`;
  };
  const title = `${type.toUpperCase()}`;
  const formattedTitle = `║ ${chalk.yellow(title.padEnd(borderLength - 4))} ║`;

  let frame = `
╔${'═'.repeat(borderLength - 2)}╗
${formattedTitle}
╠${'═'.repeat(borderLength - 2)}╣
${formatLine('Nhóm', threadName, 'cyan')}
${formatLine('Tên', senderName, 'yellow')}
${formatLine('Tin nhắn', messageBody, 'red')}
╚${'═'.repeat(borderLength - 2)}╝`;

  return frame;
}

function encryptData(data) {
  const cipher = crypto.createCipher('aes-256-ctr', 'your-secret-key');
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function ttsMessage(content) {
  TTS.getAudioBase64(content, { lang: 'vi', slow: false })
    .then(url => console.log(`Audio TTS URL: ${url}`))
    .catch(err => console.error("Lỗi TTS:", err));
}

function sendDailyReport() {
  const report = {
    time: moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY"),
    messageCount,
    userMessageCount,
    groupMessageCount,
    errorCount
  };
  logToFile(JSON.stringify(report, null, 2), 'daily_report.txt');
  console.log(chalk.green("Báo cáo hàng ngày đã được gửi."));
}

function restartConsole() {
  console.log(chalk.red("Khởi động lại console do lỗi quá nhiều!"));
  process.exit(1);
}

function enableMaintenanceMode() {
  maintenanceMode = true;
  console.log(chalk.yellow("Chế độ bảo trì đã được kích hoạt!"));
}

function disableMaintenanceMode() {
  maintenanceMode = false;
  console.log(chalk.green("Chế độ bảo trì đã được tắt!"));
}

module.exports.handleEvent = async function ({ api, Users, event }) {
  let { threadID, senderID, isGroup } = event;

  try {
    if (isConsoleDisabled || maintenanceMode) return;

    let currentTime = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss DD/MM/YYYY");
    const senderName = await Users.getNameUser(senderID);
    const messageBody = event.body || "Ảnh, video hoặc kí tự đặc biệt";
    
    let type = isGroup ? "CHAT TRONG NHÓM" : "RIÊNG TƯ";
    let threadName = "Không có";

    if (isGroup) {
      const threadInfo = await api.getThreadInfo(threadID);
      threadName = threadInfo.threadName || "No Name";
    }

    const infoFrame = createFrame(type, threadName, senderName, messageBody);
    console.log(infoFrame);

    logToFile(infoFrame);
    userMessageCount[senderID] = (userMessageCount[senderID] || 0) + 1;
    groupMessageCount[threadID] = (groupMessageCount[threadID] || 0) + 1;
    messageCount++;

    if (messageCount % 50 === 0) {
      console.log(chalk.blue(`Đã nhận được ${messageCount} tin nhắn!`));
      sendDailyReport();
    }

    detectSpam(senderID);

    let aiWarnings = aiContentAnalysis(messageBody);
    if (aiWarnings > aiWarningThreshold) {
      console.log(chalk.red(`Cảnh báo AI: Tin nhắn từ ${senderID} có nội dung nguy hiểm!`));
      logToFile(`AI Warning: ${messageBody}`, 'ai_warning_log.txt');
      ttsMessage(`Cảnh báo: Nội dung nguy hiểm từ người dùng ${senderID}`);
    }

    let sentimentResult = sentimentAnalysis(messageBody);
    if (sentimentResult.score < -3) {
      console.log(chalk.yellow(`Tin nhắn có cảm xúc tiêu cực từ ${senderID}`));
      logToFile(`Negative Sentiment: ${messageBody}`, 'negative_sentiment_log.txt');
    }

    if (Date.now() - timeStamp > 1000) {
      if (num <= max) num = 0;
    }
    if (Date.now() - timeStamp < 1000 && num >= max) {
      num = 0;
      disableConsole(this.config.cooldowns);
    }

    timeStamp = Date.now();
    limitConsoleLines();
    
  } catch (error) {
    console.log(chalk.red("Đã xảy ra lỗi: "), error);
    logToFile(`Lỗi: ${error.message}`, 'error_log.txt');
    errorCount++;
    if (errorCount > 10) restartConsole();
  }
};

module.exports.run = async function () {
  console.log("Console module đã hoạt động...");
  clearConsole();
  saveConsoleState();

  setInterval(() => {
    if (!maintenanceMode) {
      console.log(chalk.green("Hệ thống đang hoạt động bình thường."));
    } else {
      console.log(chalk.yellow("Hệ thống đang trong chế độ bảo trì."));
    }
  }, 60000);
};