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
exports.verifyJWT = void 0;
const google_auth_library_1 = require("google-auth-library");
const verifyJWT = (client_id, jwtToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!client_id || !jwtToken)
            return null;
        const client = new google_auth_library_1.OAuth2Client(client_id);
        const decodedJWT = yield client.verifyIdToken({
            idToken: jwtToken,
            audience: client_id,
        });
        const user = decodedJWT.getPayload();
        return user;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.verifyJWT = verifyJWT;
