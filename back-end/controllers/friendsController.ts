import { Request, Response } from "express";

import { Friend } from "../models/friendModel";

export const getFriendsOfUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    if (!user_id) return res.status(404).json(`user_id is required.`);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("An error occured retrieving friends.");
  }
};

export const getFriendById = async (req: Request, res: Response) => {
  try {
    return res.status(200).json("The friend was retrieved.");
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("An error occured retrieving the friend.");
  }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { user_id, friend_id } = req.body;
    if (!user_id || !friend_id)
      return res.status(404).json("Both user_id and friend_id are required.");
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("An error occured while adding the friend.");
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { user_id, friend_id } = req.body;
    if (!user_id || !friend_id)
      return res.status(404).json("Both user_id and friend_id are required.");
    return res.status(200).json("the request status is updated");
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("Error updating request status");
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const { friend_id } = req.body;
    if (!friend_id)
      return res.status(404).json("Friend_id was not provided in req.body");

    return res.status(200).json("The friend is removed");
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json("Error removing a friend");
  }
};
