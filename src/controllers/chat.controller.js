const chatModel = require("../webSocket/models/chat.model");
const chatRoom = require("../webSocket/models/chatRoom.model");
const authModel = require("../models/auth.model");
const APIResponse = require("../helper/APIResponse");
const status = require("http-status");

exports.getChatByUserId = async (req, res) => {
    try {

        const findChatRoom = await chatRoom.findOne({
            user1: req.body.user_id
        });
        console.log("findChatRoom::", findChatRoom);

        const findChatRoom2 = await chatRoom.findOne({
            user2: req.body.user_id
        })
        console.log("findChatRoom2::", findChatRoom2);

        if (findChatRoom == null && findChatRoom2 == null) {

            res.status(status.NOT_FOUND).json(
                new APIResponse("Data Not Exist", "false", 404, "0")
            )

        } else {

            if (findChatRoom) {

                const getUserData = await authModel.findOne(
                    {
                        _id: req.body.user_id
                    }
                )
                console.log("getUserData::", getUserData);

                const findChat1 = await chatModel.findOne(
                    {
                        chatRoomId: findChatRoom._id
                    }
                );
                console.log("findChat1::", findChat1);

                const chatMessage = findChat1.chat;
                const getLastMessage = chatMessage[chatMessage.length - 1];
                console.log("getLastMessage:::", getLastMessage.message);

                const response = {
                    profile: getUserData.profile[0].res,
                    chatRoomId: findChat1.chatRoomId,
                    username: getUserData.username,
                    message: getLastMessage.message,
                }

                res.status(status.OK).json(
                    new APIResponse("Get Chat Details By UserId", true, 200, 1, response)
                )

            } else {

                const getUserData = await authModel.findOne(
                    {
                        _id: req.body.user_id
                    }
                )
                console.log("getUserData::", getUserData);

                const findChat2 = await chatModel.findOne(
                    {
                        chatRoomId: findChatRoom2._id
                    }
                );
                console.log("findChat2::", findChat2);

                const chatMessage2 = findChat2.chat;
                const getLastMessage2 = chatMessage2[chatMessage2.length - 1];
                console.log("getLastMessage2:::", getLastMessage2.message);

                const response = {
                    profile: getUserData.profile[0].res,
                    chatRoomId: findChat2.findChat2,
                    username: getUserData.username,
                    message: getLastMessage2.message,
                }

                res.status(status.OK).json(
                    new APIResponse("Get Chat Details By UserId", true, 200, 1, response)
                )

            }

        }

    } catch (error) {

        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            new APIResponse("Something Went Wrong", "false", 500, "0", error.message)
        )

    }
}

exports.getAllChatData = async (req, res) => {
    try {

        const findChatRoom = await chatModel.findOne({
            chatRoomId: req.body.chat_room_id
        });
        console.log("findChatRoom::", findChatRoom);


        if(findChatRoom == null) {

            res.status(status.NOT_FOUND).json(
                new APIResponse("Data Not Exist", "false", 404, "0")
            )

        } else {

            res.status(status.OK).json(
                new APIResponse("Get All Chat Details By UserId", true, 200, 1, findChatRoom)
            )

        }



        // if (findChatRoom == null && findChatRoom2 == null) {

        //     res.status(status.NOT_FOUND).json(
        //         new APIResponse("Data Not Exist", "false", 404, "0")
        //     )

        // } else {

        //     if (findChatRoom) {

        //         const findChat1 = await chatModel.findOne(
        //             {
        //                 chatRoomId: findChatRoom._id
        //             }
        //         );
        //         console.log("findChat1::", findChat1);

        //         res.status(status.OK).json(
        //             new APIResponse("Get All Chat Details By UserId", true, 200, 1, findChat1)
        //         )

        //     } else {

        //         const findChat2 = await chatModel.findOne(
        //             {
        //                 chatRoomId: findChatRoom2._id
        //             }
        //         );
        //         console.log("findChat2::", findChat2);

        //         res.status(status.OK).json(
        //             new APIResponse("Get All Chat Details By UserId", true, 200, 1, findChat2)
        //         )

        //     }

        // }

    } catch (error) {

        console.log("Error:", error);
        res.status(status.INTERNAL_SERVER_ERROR).json(
            new APIResponse("Something Went Wrong", "false", 500, "0", error.message)
        )
        
    }
}