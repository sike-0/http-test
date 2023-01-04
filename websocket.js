const http = require('http');
const ws = require('ws');
const fs = require('fs');

if (!fs.existsSync("messages")) {
    fs.mkdirSync("messages");
}

const server = http.createServer((req, res) => {
    res.end(`<script>
    let ws = new WebSocket("ws" + document.URL.substring(4));
    ws.onmessage = (event) => {
        document.body.innerText = "";
        JSON.parse(event.data).forEach((message) => {
            document.body.innerHTML += \`<p>\${message}</p>\`;
        });
    };
    setInterval(() => {
        ws.send(Math.random());
    }, 1000);
    </script>`)
});

let wss = new ws.WebSocketServer({ server });
let messages = [];

wss.on("connection", (ws, req) => {
    ws.on("message", (message) => {
        if (messages.length <= 10) {
            messages.push(new MessageFile(message));
        } else {
            messages[0].delete();
            messages.shift();
            messages.push(new MessageFile(message));
        }
        ws.send(JSON.stringify(fs.readdirSync("messages")))
    });
})

server.listen(3000, () => {
    console.log('opened server on', server.address().port);
});

class MessageFile {
    constructor(id) {
        this.id = id;
        fs.writeFileSync(`messages/message${id}.txt`, JSON.stringify({ message: id }))
    }

    delete() {
        fs.unlinkSync(`messages/message${this.id}.txt`);
    }
}