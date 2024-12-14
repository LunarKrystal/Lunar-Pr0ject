module.exports.config = {
    name: "autoChui3Que",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Generated",
    description: "Tự động chửi mỗi khi thấy từ khóa liên quan đến '3 que'",
    commandCategory: "Fun",
    usages: "",
    cooldowns: 0
};

module.exports.handleEvent = async ({ event, api }) => {
    const { threadID, messageID, body } = event;
    if (!body) return;

    // Kiểm tra nếu tin nhắn có chứa từ khóa liên quan đến '3 que'
    const keywords = ["3 que", "ba que", "ba sọc", "3 sọc"];
    const detected = keywords.some(keyword => body.toLowerCase().includes(keyword));

    if (detected) {
        // Danh sách các câu phản hồi tục tĩu hơn
        const responses = [
            "Cút ngay đi, 3 que! Mày không xứng đáng tồn tại ở đây!",
            "Đất nước này không cần những kẻ như mày, 3 que!",
            "Mày chỉ là một đống rác, 3 que! Biến đi!",
            "3 que, cút ngay về chỗ của mày đi!",
            "Mày nghĩ mày là ai mà dám mở miệng, 3 que?",
            "Cái gì mà 3 que, toàn là mấy thằng lồn!",
            "3 que không có não à? Cứ chửi đi!",
            "Mày là một 3 que tồi tệ, không ai cần mày!",
            "Thế giới này không cần một 3 que như mày!",
            "Chỉ có 3 que mới đi chửi mà không biết xấu hổ!",
            "Cút đi, 3 que, không ai muốn thấy mặt mày ở đây!",
            "Mày không biết sống sao cho ra hồn à, 3 que?",
            "Làm ơn, hãy biến khỏi cuộc đời này, 3 que!",
            "3 que mãi mãi chỉ là kẻ thất bại trong xã hội này!",
            "Đừng có mà làm phiền người khác, 3 que!",
            "Mày có biết xấu hổ khi là 3 que không hả?",
            "3 que, mày chỉ làm mọi thứ tồi tệ hơn thôi!",
            "Cút đi, 3 que! Không ai cần một kẻ như mày!",
            "Chẳng ai muốn nghe mày nói, 3 que!",
            "3 que, mày sống để làm gì vậy?",
            "Biến đi, 3 que! Mày không có quyền ở đây!",
            "Cái gì mà 3 que, mày chỉ làm ô nhiễm môi trường này!",
            "Mày không có gì tốt đẹp trong cuộc sống của mình, 3 que!",
            "3 que không biết rằng mình chỉ là một trò cười!",
            "Mày chỉ là một kẻ thua cuộc, 3 que!",
            "3 que, hãy tự nhìn lại mình đi!",
            "Dân tộc này không cần những kẻ như mày, 3 que!",
            "Chẳng có lý do gì để giữ lại mày, 3 que!",
            "Cút ngay khỏi đây, 3 que! Không ai muốn mày!",
            "Mày sẽ mãi mãi là một 3 que trong mắt mọi người!",
            "Đừng mơ mộng về sự chấp nhận, 3 que!",
            "Mày không biết gì cả, chỉ biết chửi bới, 3 que!"
        ];

        // Chọn ngẫu nhiên một phản hồi từ danh sách
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Gửi phản hồi
        api.sendMessage(randomResponse, threadID, messageID);
    }
};

module.exports.run = () => {};
