const net = require("net");

module.exports = class Peer {
  constructor(port) {
    this.port = port;
    this.connections = [];
    this.knownHosts = [];


    const server = net.createServer((socket) =>
      this.handleClientConnection(socket)
    );

    server.listen(port, () => console.log("Listening on port: ", port));
  }

  connectTo(address, sendKnownHosts = true, loopback = false) {
    let splittedAddress = address.split(":");

    
    if (splittedAddress.length < 2) {
      throw Error("Invalid host address. Expected host:port ");
    }

    const port = splittedAddress.splice(-1, 1)[0];
    const host = splittedAddress.join(":");

    const socket = net.createConnection({ port, host }, () => {
      this.addConnection(socket);
      this.listenClientData(socket);

      this.sendWelcomeMessage(socket, this.port, loopback, sendKnownHosts);
    });
  }

  sendWelcomeMessage(socket, myPort, loopback = false, sendKnownHosts) {
    const obj = {
      type: "welcome",
      myPort,
      loopback,
      knownHosts: this.knownHosts,
    };

    this.sendMessage(socket, obj);
  }

  handleWelcomeMessage(socket, data) {
    if (data.type !== "welcome") {
      return;
    }

    const { remoteAddress } = socket;
    const { myPort } = data;

    this.connectToReceivedKnownHosts(data.knownHosts);

    const hostObj = this.getHostObj(remoteAddress, myPort);

    this.addKnownHost(hostObj);

    if (!data.loopback) {
      this.connectTo(`${remoteAddress}:${myPort}`, true, true);
    }
  }

  connectToReceivedKnownHosts(knownHosts) {
    knownHosts.forEach((hostObj) => {
      this.connectToNewKnownHost(hostObj);
    });
  }

  connectToNewKnownHost(hostObj) {
    if (this.isKnownHost(hostObj)) {
      return;
    }

    this.connectTo(`${hostObj.host}:${hostObj.port}`, false);
  }

  getHostObj(host, port) {
    return { host, port };
  }

  addKnownHost(hostObj) {
    console.log("\n[Added known host ", hostObj);
    this.knownHosts.push(hostObj);
  }

  addConnection(socket) {
    this.connections.push(socket);
  }

  isKnownHost(hostObj) {
    if (hostObj.port === this.port) {
      return true;
    }

    const alreadyKnownHostObj = this.knownHosts.find(
      (knownHost) =>
        knownHost.host === hostObj.host && knownHost.port === hostObj.port
    );

    return alreadyKnownHostObj != null;
  }

  handleClientConnection(socket) {
    this.listenClientData(socket);
  }

  listenClientData(socket) {
    this.onConnection(socket);

    socket.on("data", (bufferData) => {
      const jsonData = bufferData.toString();
      const data = JSON.parse(jsonData);

      this.onData(socket, data);

      this.handleWelcomeMessage(socket, data);
    });
  }

  broadcastMessage(jsonData) {
    this.connections.forEach((socket) => this.sendMessage(socket, jsonData));
  }

  sendMessage(socket, jsonData) {
    const data = JSON.stringify(jsonData);

    try {
      if (!socket._writableState.ended) {
        socket.write(data);
      }
    } catch (e) {}
  }
};
