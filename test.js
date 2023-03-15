const Peer = require('peerjs');

state = {
    myId: '',
    friendId: '',
    peer: {},
    message: '',
    messages: []
}

const peer = new Peer('', {
    host: 'localhost',
    port: '3001',
    path: '/'
});

peer.on('open', (id) => {
    this.setState({
        myId: id,
        peer: peer
       });
});

peer.on('connection', (conn) => {
    conn.on('data', (data) => {
        this.setState({
          messages: [...this.state.messages, data]
        });
     });
});

send = () => {
    const conn = this.state.peer.connect(this.state.friendId);
    conn.on('open', () => {
      const msgObj = {
        sender: this.state.myId,
        message: this.state.message
      };
     conn.send(msgObj);
      this.setState({
        messages: [...this.state.messages, msgObj],
        message: ''
      });
    });
}