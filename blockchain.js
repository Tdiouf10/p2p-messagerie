const { time } = require('console');
const SHA256 = require('js-sha256');
const ws = require('ws');
//const Peer = require('peerjs');

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

    replaceChainWithNewChain(newChain){
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




// let message1 = {
//     sender: 'A',
//     senderAddress: 'A',
//     reciever: 'B',
//     recieverAddress: 'B',
//     content: 'Hello',
// }

// let message2 = {
//     sender: 'A',
//     senderAddress: 'A',
//     reciever: 'B',
//     recieverAddress: 'B',
//     content: 'rrrrrrrrr',
// }



// test.addBlock(new Block(1, Date(), message2));

// test.addBlock(new Block(2, Date(), message1));

// b2 = new Block(3, Date(), message1);

// test.addBlock(b2);



module.exports = {
    Block,
    Blockchain,
}