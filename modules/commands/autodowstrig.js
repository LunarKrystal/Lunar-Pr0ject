const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs");

module.exports = {
    config: {
        name: "autodowstrig",
        version: "1.0.0",
        hasPermission: 0,
        credits: "tnt",
        description: "Download Instagram stories",
        commandCategory: "Tiện ích",
        usages: "",
        cooldowns: 5
    },
    
    run: ({ api, event, args }) => {},    
    handleEvent: async ({ api, event }) => {
        const { body, senderID } = event;
        const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss || D/MM/YYYY");
        
        if (!body || (!body.includes('https://www.instagram.com/stories/') && !body.includes('https://www.instagram.com/s/'))) return;

        const options = {
            method: 'GET',
            url: 'https://instagram-post-reels-stories-downloader.p.rapidapi.com/instagram/',
            params: {
                url: body
            },
            headers: {
                'X-RapidAPI-Key': '540aa903bdmsh0a33f8b6f825e2bp125b81jsn17e1c26d383f',
                'X-RapidAPI-Host': 'instagram-post-reels-stories-downloader.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const storyURL = response.data.result[0].url; 

            if (!storyURL) {
                console.error("No story URL found in the response");
                return;
            }

            const storyResponse = await axios.get(storyURL, { responseType: "arraybuffer" });
            const storyData = Buffer.from(storyResponse.data, 'binary');

            const fileName = `${moment().format("YYYYMMDD-HHmmss")}.mp4`;
            const filePath = `./${fileName}`;

            fs.writeFileSync(filePath, storyData);

            api.sendMessage({
                body: `Tự động tải story vào lúc ${gio}`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, event.messageID);

            fs.unlinkSync(filePath); 
        } catch (error) {
            console.error(error);
            
        }
    }
};
