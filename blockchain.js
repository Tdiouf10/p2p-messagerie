const SHA256 = require('js-sha256');

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
        return this.data;
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 0;
    }

    createGenesisBlock(){
        return new Block(0, "16/02/2023", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    getAllMessages(name){
        let messages = [];
        for(let i = 1; i < this.chain.length; i++){
            if (this.chain[i].getDatas().sender == name){
                messages.push(this.chain[i].getDatas());
            }
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


let test= new Blockchain();

let message1 = {
    sender: 'A',
    senderAddress: 'A',
    reciever: 'B',
    recieverAddress: 'B',
    content: 'Hello',
}

test.addBlock(new Block(1, "01/02/2023", message1));

test.addBlock(new Block(2, "01/03/2023", message1));

console.log(test);

console.log(test.getAllMessages('A'));

console.log(test.isValidChain());

let test2= new Blockchain();

test2.addBlock(new Block(1, "01/02/2023", message1));

test2.addBlock(new Block(2, "01/03/2023", message1));

test2.addBlock(new Block(3, "01/04/2023", message1));

console.log('0');

console.log(test);

console.log('1');
console.log(test2);



console.log('2');
console.log(test);

console.log('3');
console.log(test2)

test.replaceChain(test2.chain);