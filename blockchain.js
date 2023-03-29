const { time } = require('console');
const SHA256 = require('js-sha256');
const ws = require('ws');
//const Peer = require('peerjs');
const prompt = require('prompt-sync')();

const message = {
    sender: '',
    senderAddress: '',
    reciever: '',
    recieverAddress: '',
    content: '',
}


class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp +this.nonce+ JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }

    getDatas(){
        return this.data.content;
    }

    addData(data){
        let newdata = this.data;
        newdata.push(data);
        this.data = newdata;
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 0;    
    }

    createGenesisBlock(){
        return new Block(0, Date(), "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    getAllMessages(){
        let messages = [];
        for(let i = 1; i<this.chain.length; i++){
            messages.push(this.chain[i].getDatas());
        }
        return messages;
    }

    isValidChain(){
        for (let i=1; i<this.chain.length;i++){
            const curentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if ( (curentBlock.previousHash !== previousBlock.hash)) {
                return false;
            }
            return true;
        }
    }

    replaceChain(newChain){
        if (newChain.length <= this.chain.length){
            console.log('Received chain is not longer than the current chain.');
            return;
        } else if (!this.isValidChain(newChain)){
            console.log('The received chain is not valid.');
            return;
        }
        console.log('Replacing blockchain with the new chain.');
        this.chain = newChain;
    }
}

// let connectPeers= (newpeers)=>{
//     newpeers.forEach(peer => {
//         let wsPeer = new ws(peer);
//         wsPeer.on('open', ()=> initconnection(wsPeer));
//         wsPeer.on('error', ()=> console.log('connection failed'));
//     });
// }

// let initHttpServer = () => {
//     let app= express();
//     app.use(bodyParser.json());
//     app.get('/blocks', (req, res) => res.send(JSON.stringify(blockchain)));
//     app.post('/mineBlock', (req, res) => {
//         let newBlock = generateNextBlock(req.body.data);
//         addBlock(newBlock);
//         broadcast(responseLatestMsg());
//         console.log('block added: ' + JSON.stringify(newBlock));
//         res.send();
//     });
//     app.get('/peers', (req, res) => {
//         res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
//     });
//     app.post('/addPeer', (req, res) => {
//         connectToPeers([req.body.peer]);
//         res.send();
//     });
//     app.listen(http_port, () => console.log('Listening http on port: ' + http_port));
// };


let test= new Blockchain();

let message1 = {
    sender: 'A',
    senderAddress: 'A',
    reciever: 'B',
    recieverAddress: 'B',
    content: 'Hello',
}

let message2 = {
    sender: 'A',
    senderAddress: 'A',
    reciever: 'B',
    recieverAddress: 'B',
    content: 'rrrrrrrrr',
}



test.addBlock(new Block(1, Date(), message2));

test.addBlock(new Block(2, Date(), message1));

b2 = new Block(3, Date(), message1);

test.addBlock(b2);

console.log(test);

console.log(test.getAllMessages('A'));

console.log(test.isValidChain());

let test2= new Blockchain();

test2.addBlock(new Block(1, Date(), message1));

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

sleep(2000);

test2.addBlock(new Block(2, Date(), message1));

sleep(2000);

test2.addBlock(new Block(3, Date(), message1));

console.log('0');

console.log(test);

console.log('1');
console.log(test2);



console.log('2');
console.log(test);

console.log('3');
console.log(test2)


console.log(test.getAllMessages());

sleep(2000);

test.replaceChain(test2.chain);


let t = new Date();

let t2=t.getDate()+"/"+t.getMonth()+"/"+t.getFullYear()+' '+ t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();

console.log(t2);
           
// // import readline module
// const readline = require("readline");

// // create interface for input and output
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// // create empty user input
// let usname = [];
// let psswd = [];

// function Login(name,password){
//         for (let i=0 ; i<usname.length ; i++){
//             if (usname[i]==name && psswd[i]==password){
//                 console.log("tu es bienvenue");
//                 return 2;
//             }else{
//                 return(1);
//             }
//         }
//     }


// function Register(name,password){
//     usname.push(name);
//     psswd.push(password);
// }
// let a;
// // question user to enter name
// // while (a!=2) {
//     const userInput = prompt("T'as un compte O/N ? ");
//     if (userInput=="O" || userInput=="o"){
//       const name = prompt('What is your name? ');
//       const psw = prompt('What is your password? ');
//       a = Login(name,psw)
//     }else if (userInput=="N" || userInput=="n"){
//       const nam = prompt('What is your name? ');
//       const ps = prompt('What is your password? ');
//       Register(nam,ps)
//       console.log("tu es bienvenue");
//       a = 2
//     } else {
//         console.log('Hein')
//     }
//     rl.close()
// // }

// // const name = prompt('What is your name? ');
// // console.log(`Hi ${name}!`);


