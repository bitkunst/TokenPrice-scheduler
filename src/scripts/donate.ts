import {
    ASSIGNMENT_CONTRACT_ADDRESS,
    BSC_TESTNET_RPC_URL,
} from '../constants/web3.constants';
import Web3, { Contract, Transaction } from 'web3';
import * as fs from 'fs';
import * as path from 'path';

class Web3ContractService {
    private web3: Web3;
    private contract: Contract<any>;

    constructor(rpcUrl: string) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    }

    getWeb3() {
        return this.web3;
    }

    setContract(abi: any, address: string) {
        this.contract = new this.web3.eth.Contract(abi, address);
    }

    getContract() {
        return this.contract;
    }

    getContractAddress() {
        return this.contract.options.address;
    }

    getAccount(privateKey: string) {
        return this.web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    async sendTransaction(txObj: Transaction, privateKey: string) {
        const signedTx = await this.web3.eth.accounts.signTransaction(
            txObj,
            privateKey,
        );
        const tx = await this.web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
        );
        return tx;
    }

    toWei(amount: string) {
        return this.web3.utils.toWei(amount, 'ether');
    }

    toEth(amount: string) {
        return this.web3.utils.fromWei(amount, 'ether');
    }
}

async function donate(rpcUrl: string, contractAddress: string) {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const AMOUNT = process.env.AMOUNT;
    if (!PRIVATE_KEY || !AMOUNT) {
        throw new Error(
            'Please set up your PRIVATE_KEY and AMOUNT in the environment',
        );
    }

    try {
        const web3ContractService = new Web3ContractService(rpcUrl);
        const filePath = path.resolve(__dirname, '../abi/Assignment_abi.json');
        const contract_abi = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        web3ContractService.setContract(contract_abi, contractAddress);

        const fromAccount = web3ContractService.getAccount(PRIVATE_KEY);
        const contract = web3ContractService.getContract();
        const web3 = web3ContractService.getWeb3();

        const nonce = await web3.eth.getTransactionCount(fromAccount.address);
        const data = contract.methods.donate().encodeABI();
        const txObj = {
            nonce,
            from: fromAccount.address,
            to: contractAddress,
            value: web3ContractService.toWei(AMOUNT),
            data,
        };
        const gas = await web3.eth.estimateGas(txObj);
        const gasPrice = await web3.eth.getGasPrice();

        const tx = await web3ContractService.sendTransaction(
            {
                ...txObj,
                gas,
                gasPrice,
            },
            PRIVATE_KEY,
        );

        console.log('Tx hash :', tx.transactionHash);
    } catch (error) {
        console.error(error);
    }
}

donate(BSC_TESTNET_RPC_URL, ASSIGNMENT_CONTRACT_ADDRESS);
