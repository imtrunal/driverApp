const chatRoom = require("./models/chatRoom.model");
const chatModel = require("./models/chat.model");

function socket(io) {
    console.log("SETUP :- Socket Loading....");

    io.on("connection", (socket) => {
        console.log("SETUP :- Socket Connected");
        console.log("New User Id :: " + socket.id);

        // ----- joinUser ----- //
        socket.on("joinUser", (arg) => {
            const userRoom = `User${arg.user_id}`;
            socket.join(userRoom)
        })
        // ----- joinUser ----- //


        // ----- chat ----- //
        socket.on("chat", async (arg) => {
            const userRoom = `User${arg.receiver_id}`;

            const checkUser1 = await chatRoom.findOne(
                {
                    user1: arg.sender_id,
                    user2: arg.receiver_id
                }
            ).select('user1 , user2').lean();
            console.log("checkUser1::", checkUser1);

            const checkUser2 = await chatRoom.findOne(
                {
                    user1: arg.receiver_id,
                    user2: arg.sender_id
                }
            ).select('user1 , user2').lean();
            console.log("checkUser2::", checkUser2);

            if (checkUser1 == null && checkUser2 == null) {

                const createChatRoom = await chatRoom({
                    user1: arg.sender_id,
                    user2: arg.receiver_id
                });
                const saveData = await createChatRoom.save();

                const getChatRoom = await chatRoom.findOne({
                    user1: arg.sender_id,
                    user2: arg.receiver_id
                }).select('user1, user2').lean();
                console.log("getChatRoom::", getChatRoom);

                const getChatRoom2 = await chatRoom.findOne({
                    user1: arg.receiver_id,
                    user2: arg.sender_id
                }).select('user1, user2').lean();


                if (getChatRoom == null && getChatRoom2 == null) {

                } else {

                    if (getChatRoom) {

                        const addDataInChat = await chatModel({
                            chatRoomId: getChatRoom._id,
                            chat: {
                                sender: arg.sender_id,
                                receiver: arg.receiver_id,
                                message: arg.message
                            }
                        });
                        console.log("addDataInChat::", addDataInChat);

                        const saveChatData = await addDataInChat.save();
                        console.log("saveChatData::", saveChatData);

                        io.to(userRoom).emit("chatReceive", saveChatData)

                    } else {

                        const addDataInChat = await chatModel({
                            chatRoomId: getChatRoom2._id,
                            chat: {
                                sender: arg.sender_id,
                                receiver: arg.receiver_id,
                                message: arg.message
                            }
                        });
                        console.log("addDataInChatElsePart::", addDataInChat);

                        const saveChatData = await addDataInChat.save();
                        console.log("saveChatData::", saveChatData);

                        io.to(userRoom).emit("chatReceive", saveChatData)

                    }

                }


            } else {

                const getChatRoom = await chatRoom.findOne({
                    user1: arg.sender_id,
                    user2: arg.receiver_id
                }).select('user1, user2').lean();
                console.log("getChatRoom::", getChatRoom);

                const getChatRoom2 = await chatRoom.findOne({
                    user1: arg.receiver_id,
                    user2: arg.sender_id
                }).select('user1, user2').lean();
                console.log("getChatRoom2::", getChatRoom2);

                if (getChatRoom == null && getChatRoom2 == null) {

                } else {

                    if (getChatRoom) {

                        const findChatRoom = await chatModel.findOne({
                            chatRoomId: getChatRoom._id
                        }).lean();
                        console.log("findChatRoom::", findChatRoom);

                        if (findChatRoom == null) {

                            const addDataInChat = await chatModel({
                                chatRoomId: getChatRoom._id,
                                chat: {
                                    sender: arg.sender_id,
                                    receiver: arg.receiver_id,
                                    message: arg.message
                                }
                            });
                            console.log("addDataInChat::", addDataInChat);

                            const saveChatData = await addDataInChat.save();
                            console.log("saveChatData::", saveChatData);

                            io.to(userRoom).emit("chatReceive", saveChatData)

                        } else {

                            const chatData = {
                                sender: arg.sender_id,
                                receiver: arg.receiver_id,
                                message: arg.message
                            }

                            const updateChat = await chatModel.updateOne(
                                {
                                    chatRoomId: getChatRoom._id
                                },
                                {
                                    $push: {
                                        chat: chatData
                                    }
                                }
                            )
                            console.log("updateChat..");

                            const getChatData = await chatModel.findOne(
                                {
                                    chatRoomId: getChatRoom._id
                                }
                            )
                            console.log("getChatData::",getChatData);

                            io.to(userRoom).emit("chatReceive", getChatData)

                        }



                    } else {

                        const findChatRoom2 = await chatModel.findOne({
                            chatRoomId: getChatRoom2._id
                        }).lean();
                        console.log("findChatRoom2::", findChatRoom2);

                        if (findChatRoom2 == null) {

                            const addDataInChat = await chatModel({
                                chatRoomId: getChatRoom2._id,
                                chat: {
                                    sender: arg.sender_id,
                                    receiver: arg.receiver_id,
                                    message: arg.message
                                }
                            });
                            console.log("addDataInChatElsePart::", addDataInChat);

                            const saveChatData = await addDataInChat.save();
                            console.log("saveChatData::", saveChatData);

                            io.to(userRoom).emit("chatReceive", saveChatData)

                        } else {

                            const chatData = {
                                sender: arg.sender_id,
                                receiver: arg.receiver_id,
                                message: arg.message
                            }

                            const updateChat = await chatModel.updateOne(
                                {
                                    chatRoomId: getChatRoom2._id
                                },
                                {
                                    $push: {
                                        chat: chatData
                                    }
                                }
                            )
                            console.log("updateChatElse..");

                            const getChatData2 = await chatModel.findOne(
                                {
                                    chatRoomId: getChatRoom2._id
                                }
                            )
                            console.log("getChatData2::",getChatData2);

                            io.to(userRoom).emit("chatReceive", getChatData2)

                        }

                    }

                }

            }

        })
        // ----- End chat ----- //

    })

}

module.exports = socket