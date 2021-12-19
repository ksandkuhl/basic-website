const http = require("http");
const fs = require("fs");
const { WebSocketServer } = require("ws");

const createServer = () => {
  return new http.Server((req, res) => {
    if (req.url === "/ping") {
      res.writeHead(200);
      res.end(filesChanged);
      filesChanged = "0";
      return;
    }
    const path = req.url === "/" ? "/index.html" : req.url;
    try {
      const file = fs.readFileSync(__dirname + path);
      res.writeHead(200);
      res.end(file);
    } catch (error) {
      res.writeHead(404);
      res.end("noz fundus");
    }
  });
};
createServer().listen(3000, "localhost", () => {
  console.log(`Server is running on http://localhost:3000`);
});

let ws;
const wss = new WebSocketServer({ port: 3001, perMessageDeflate: false });

wss.on("connection", (socket) => {
  ws = socket;
});

fs.watch(__dirname, function (event, filename) {
  if (event == "change") {
    ws && ws.send("reload");
  }
});
