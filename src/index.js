const Peer = require("./Peer");
const Blockchain = require('../blockchain')

// if (blockchain === undefined) blockchain = new Blockchain.Blockchain()

let blockchain = new Blockchain.Blockchain();
let port;
let peer = null;

let hosts = [];

username = Math.floor(Math.random() * 10001) + 1;

(function () {
  console.log("\n\n");
  main();

  process.stdin.on("data", (bufferData) => {
    const data = bufferData.toString();
    console.log(data);
    onNewInputMessage(data);
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
    console.log(host) 
    host=host.split(":");
    if (host[1] == String(port)){
      port = port + Date.now() % 10000;
    }
  }

  //si on enelève la boucle cpappt
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
  console.log(data.chain)
  blockchain.addBlock(new Blockchain.Block(blockchain.getpreviousID()+1, Date(),data.split("\r")[0]));
  console.log(blockchain);
  console.log(blockchain.getAllMessages());
  console.log(data.split("\r")[0]);
  peer.broadcastMessage({ type: "message", message: data, myPort: port, chain: JSON.stringify(blockchain) });
  
}

function onConnection(socket) {}

function onData(socket, data) {
  const { remoteAddress } = socket;
  console.log("a")
  // console.log(JSON.parse(data.chain))
  if(data.chain){
    console.log(JSON.parse(data.chain))
  }
  console.log("b")
  const { type, message, myPort } = data;

  if (type === "message") {
    // console.log(blockchain.getAllMessages());
    console.log(blockchain)
    // let a = JSON.parse(data.chain);
    // console.log(a)
    console.log(blockchain)
    if (data.chain) {
      console.log(data.chain[0])
      let a = JSON.parse(data.chain);
      console.log(a)
      console.log("drtfg")
      console.log(a.chain)
      let b={};
      b["Blockchain"]=a.chain;
      console.log(b)
      console.log("drtfgfybjnk")
      // // console.log(a)
      // console.log(JSON.parse(data.chain))
      blockchain.replaceChainWithNewChain((b.Blockchain));
      console.log(blockchain.chain)
      console.log("drtfgfybjnk")
      // console.log(blockchain.getLastMessage())
    }
    // blockchain.replaceChainWithNewChain(data.chain)
    console.log(blockchain.getLastMessage().data)
    console.log(`\n[Message from ${remoteAddress}:${myPort}]: ${blockchain.getLastMessage()}`);
    // let a = JSON.parse(data.chain);
    // console.log(a)
    console.log(blockchain)
  }
}