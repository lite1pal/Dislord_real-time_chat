import { OAuth2Client } from "google-auth-library";

export const verifyJWT = async (client_id: any, jwtToken: any) => {
  try {
    if (!client_id || !jwtToken) return null;
    const client = new OAuth2Client(client_id);
    const decodedJWT = await client.verifyIdToken({
      idToken: jwtToken,
      audience: client_id,
    });
    const user = decodedJWT.getPayload();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
