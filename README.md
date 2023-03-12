# Project Title: Dislord
## Project description
Dislord is an open-source, (real-time in future) chat application built with NodeJS, ExpressJS and React. It allows users to create chats and send messages. The project implements signup and login system.
## Main features
- User authentication: users can sign up, log in and log out securely.
- Chats: user is able to make a chat with other one.
- Messages: users can send messages in chats they are in.
## Getting started
To get started working with Dislord, follow these steps please:
1. Download the repository or clone it using `git clone https://github.com/lite1pal/dislordAPI.git`
2. Being in the project's folder, install third-party modules: `npm install`
3. Start the server with `npm run start` or if all the time restarting the server after changing lines is not an option, then `nodemon server.js` is the right way
4. Open a browser and navigate to `http://localhost:4001`

## The following endpoints are available in Dislord API
| Endpoint               | Method | Description                       |
| --------               | ------ |    -------                        |
| */api/users*           | GET    | Retrieve users  |
| */api/users/:userId*    | PUT    | Update a specific user            |
| */api/users/signup*      | POST  | Create a new user |
| */api/users/login*       | POST  | Log a user in     |
| */api/chats*    | GET   | Retrieve chats    |
| */api/chats/:user1_id/:user2_id* | POST  | Create a new chat between 2 users |
| */api/messages/:chatId* | GET | Retrieve messages from a chat |
| */api/messages/:chatId/:userId* | POST | Create a new message from a user in a chat he is in |
