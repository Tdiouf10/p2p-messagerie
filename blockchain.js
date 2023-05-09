const SHA256 = require('js-sha256');
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp +this.nonce+ JSON.stringify(this.data)).toString();
    }

    mineBlock(){
        this.hash = this.calculateHash();
    }

    getDatas(){
        return this.data;
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
    }

    getChain(){
        return this.chain;
    }

    createGenesisBlock(){
        return new Block(0, Date(), "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock();
        this.chain.push(newBlock);
    }

    getAllMessages(){
        let messages = [];
        for(let i = 1; i<this.chain.length; i++){
            messages.push(this.chain[i].data);
        }
        return messages;
    }

    getLastMessage(){
        return this.chain[this.chain.length-1].data;
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
            return;
        }
        this.chain = newChain;
    }

    getpreviousID(){
        return this.chain[this.chain.length-1].index;
    }
}

module.exports = {
    Block,
    Blockchain,
}