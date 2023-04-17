export const getRequestOptions = (method, token, body) => {
  const headers = () => {
    if (["POST", "PUT", "DELETE"].includes(method)) {
      return {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }
    return { Authorization: `Bearer ${token}` };
  };

  if (!body) return { method, headers: headers() };
  return { method, headers: headers(), body: JSON.stringify(body) };
};
