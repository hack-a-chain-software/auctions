import { useMemo, useState } from 'react';
import { AptosClient, Types } from 'aptos';
import {
    useWallet,
    SignMessageResponse,
    WalletAdapterNetwork
} from '@manahippo/aptos-wallet-adapter';
import { DEVNET_NODE_URL, MAINNET_NODE_URL } from '../../config/aptosConstants';
import { faucetClient, coinClient } from '../../config/aptosClient';
import { AptosAccount } from 'aptos';


const [txLoading, setTxLoading] = useState({
    sign: false,
    transaction: false,
    faucet: false
});
const [txLinks, setTxLinks] = useState<string[]>([]);
const [faucetTxLinks, setFaucetTxLinks] = useState<string[]>([]);
const [signature, setSignature] = useState<string | SignMessageResponse>('');
const [balance, setBalance] = useState(0)
const {
    autoConnect,
    connect,
    disconnect,
    account,
    wallets,
    signAndSubmitTransaction,
    connecting,
    connected,
    disconnecting,
    wallet: currentWallet,
    signMessage,
    signTransaction,
    network
} = useWallet();

const { aptosClient } = useMemo(() => {
    return {
        aptosClient:
            network?.name === WalletAdapterNetwork.Mainnet
                ? new AptosClient(MAINNET_NODE_URL)
                : new AptosClient(DEVNET_NODE_URL)
    };
}, [network?.name]);



export const signTransac = async () => {
    try {
        setTxLoading({
            ...txLoading,
            transaction: true
        });
        if (account?.address || account?.publicKey) {
            const addressKey = account?.address?.toString() || account?.publicKey?.toString() || '';
            const demoAccount = new AptosAccount();
            await faucetClient.fundAccount(demoAccount.address(), 0);
            const payload: Types.TransactionPayload = {
                type: 'entry_function_payload',
                function: '0x1::coin::transfer',
                type_arguments: ['0x1::aptos_coin::AptosCoin'],
                arguments: [
                    demoAccount.address().hex(),
                    ['Fewcha'].includes(currentWallet?.adapter?.name || '') ? 717 : '717'
                ]
            };
            const transactionRes = await signTransaction(payload);
            console.log('test sign transaction: ', transactionRes);
        }
    } catch (err: any) {
        console.log('tx error: ', err.msg || err.message);
    } finally {
        setTxLoading({
            ...txLoading,
            transaction: false
        });
    }
};

export const transferToken = async () => {
    try {
        setTxLoading({
            ...txLoading,
            transaction: true
        });
        const txOptions = {
            max_gas_amount: '1000',
            gas_unit_price: '1'
        };
        if (account?.address || account?.publicKey) {
            const demoAccount = new AptosAccount();
            await faucetClient.fundAccount(demoAccount.address(), 0);
            const payload: Types.TransactionPayload = {
                type: 'entry_function_payload',
                function: '0x1::coin::transfer',
                type_arguments: ['0x1::aptos_coin::AptosCoin'],
                arguments: [
                    demoAccount.address().hex(),
                    ['Fewcha'].includes(currentWallet?.adapter?.name || '') ? 717 : '717'
                ]
            };
            const transactionRes = await signAndSubmitTransaction(payload, txOptions);
            await aptosClient.waitForTransaction(transactionRes?.hash || '');
            const links = [
                ...txLinks,
                `https://explorer.${network.name}.aptos.dev/txn/${transactionRes?.hash}`
            ];
            setTxLinks(links);
        }
    } catch (err: any) {
        console.log('tx error: ', err.msg || err.message);
    } finally {
        setTxLoading({
            ...txLoading,
            transaction: false
        });
    }
};

export const renderTxLinks = () => {
    return txLinks.map((link: string, index: number) => (
        <div className="flex gap-2 transaction" key={link}>
            <p>{index + 1}.</p>
            <a href={link} target="_blank" rel="noreferrer" className="underline">
                {link}
            </a>
        </div>
    ));
};

export const renderFaucetTxLinks = () => {
    return faucetTxLinks.map((link: string, index: number) => (
        <div className="flex gap-2 faucet" key={link}>
            <p>{index + 1}.</p>
            <a href={link} target="_blank" rel="noreferrer" className="underline">
                {link}
            </a>
        </div>
    ));
};

const messageToSign = useMemo(
    () =>
        `Hello from account ${Array.isArray(account?.publicKey)
            ? JSON.stringify(account?.publicKey, null, 2)
            : account?.publicKey?.toString() || account?.address?.toString() || ''
        }`,
    [account]
);

export const signMess = async () => {
    try {
        setTxLoading({
            ...txLoading,
            sign: true
        });
        const nonce = 'random_string';
        const msgPayload = [
            'pontem',
            'petra',
            'martian',
            'fewcha',
            'rise wallet',
            'snap',
            'bitkeep',
            'blocto',
            'coin98',
            'foxwallet',
            'openblock'
        ].includes(currentWallet?.adapter?.name?.toLowerCase() || '')
            ? {
                message: messageToSign,
                nonce
            }
            : messageToSign;
        const signedMessage = await signMessage(msgPayload);
        const response = typeof signedMessage === 'string' ? signedMessage : signedMessage.signature;
        setSignature(response);
    } catch (err: any) {
        console.log('tx error: ', err.msg);
    } finally {
        setTxLoading({
            ...txLoading,
            sign: false
        });
    }
};

export const fundAccount = async () => {
    try {
        setTxLoading({
            ...txLoading,
            faucet: true
        });
        if (account?.address) {
            const transactionRes = await faucetClient.fundAccount(account.address, 50000);
            await aptosClient.waitForTransaction(`0x${transactionRes[0]}` || '');
            const links = [
                ...faucetTxLinks,
                `https://explorer.devnet.aptos.dev/txn/0x${transactionRes[0]}`
            ];
            setFaucetTxLinks(links);
        }
    } catch (err: any) {
        console.log('tx error: ', err.msg);
    } finally {
        setTxLoading({
            ...txLoading,
            faucet: false
        });
    }
};

export const getBalance = async () => {
    try {
        // @ts-ignore
        // account.address === MaybeHexString, and checkBalance need {address: HexString}
        const result = await coinClient.checkBalance(account?.address);
        if (result) {
            // result === 387242100n, and really balance 3.87242100
            setBalance(parseInt(String(result)) / 100000000)
        }
    } catch (err: any) {
        console.log('balance error: ', err.msg);
    }
}
