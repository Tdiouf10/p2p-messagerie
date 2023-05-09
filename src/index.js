const Peer = require("./Peer");
const Blockchain = require('../blockchain')
const CryptoJS = require('crypto-js');

let blockchain = new Blockchain.Blockchain();
let port;
let peer = null;

let hosts = [];

username = Math.floor(Math.random() * 10001) + 1;

(function () {
  main();

  process.stdin.on("data", (bufferData) => {
    const data = bufferData.toString();
    if (data === "exit\r\n" || data === "quit\r\n") {
      process.exit();
    }else{
      console.log("Message send to all peers");
      onNewInputMessage(data);
    }
  });
})();

function main() {
  
  hosts = getHosts();
  port = getPort();

  
  peer = new Peer(port);

  hosts.forEach((peerAddress) => peer.connectTo(peerAddress));

  peer.onConnection = onConnection;
  peer.onData = onData;
}

function getPort() {
  let port = 21562;
  for (let host of hosts){
    host=host.split(":");
    if (host[1] == String(port)){
      port = port + Date.now() % 10000;
    }
  }
  if (!port) throw Error("PORT not found");

  return port;
}

function getHosts() {
  return process.argv.slice(2);
}

function onNewInputMessage(data) {
  if (data === "\n") {
    return;
  }

  if (!peer) {
    console.log("There's no active peer");
    return;
  }
  const secret= blockchain.getLatestBlock().hash;

  const dataSecret = CryptoJS.AES.encrypt(data.split("\r")[0], secret).toString();
  blockchain.addBlock(new Blockchain.Block(blockchain.getpreviousID()+1, Date(),dataSecret));
  peer.broadcastMessage({ type: "message",  myPort: port, chain: JSON.stringify(blockchain) });
  
}

function onConnection(socket) {}

function onData(socket, data) {
  const { remoteAddress } = socket;
  const { type, message, myPort } = data;

  if (type === "message") {
    if (data.chain) {
      let a = JSON.parse(data.chain);
      let b={};
      b["Blockchain"]=a.chain;
      blockchain.replaceChainWithNewChain((b.Blockchain));
    }
    
    const secret= blockchain.chain[blockchain.chain.length-2].hash;
    const bytes = CryptoJS.AES.decrypt(blockchain.getLastMessage(), secret);
    console.log(`\n[Message from ${remoteAddress}:${myPort}]: ${bytes.toString(CryptoJS.enc.Utf8)}`);
  }
}