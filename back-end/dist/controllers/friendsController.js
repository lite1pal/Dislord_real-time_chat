"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFriend = exports.updateRequestStatus = exports.sendFriendRequest = exports.getFriendById = exports.getFriendsOfUser = void 0;
const getFriendsOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        if (!user_id)
            return res.status(404).json(`user_id is required.`);
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json("An error occured retrieving friends.");
    }
});
exports.getFriendsOfUser = getFriendsOfUser;
const getFriendById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json("The friend was retrieved.");
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json("An error occured retrieving the friend.");
    }
});
exports.getFriendById = getFriendById;
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, friend_id } = req.body;
        if (!user_id || !friend_id)
            return res.status(404).json("Both user_id and friend_id are required.");
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json("An error occured while adding the friend.");
    }
});
exports.sendFriendRequest = sendFriendRequest;
const updateRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, friend_id } = req.body;
        if (!user_id || !friend_id)
            return res.status(404).json("Both user_id and friend_id are required.");
        return res.status(200).json("the request status is updated");
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json("Error updating request status");
    }
});
exports.updateRequestStatus = updateRequestStatus;
const removeFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { friend_id } = req.body;
        if (!friend_id)
            return res.status(404).json("Friend_id was not provided in req.body");
        return res.status(200).json("The friend is removed");
    }
    catch (error) {
        console.error(error.message);
        return res.status(500).json("Error removing a friend");
    }
});
exports.removeFriend = removeFriend;
