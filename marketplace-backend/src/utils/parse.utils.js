exports.parseRequestBody = (req, callback) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    try {
      callback(JSON.parse(body));
    } catch (error) {
      callback(null, error);
    }
  });
};
