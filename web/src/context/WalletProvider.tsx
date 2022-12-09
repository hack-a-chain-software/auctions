import {
    HippoExtensionWalletAdapter,
    MartianWalletAdapter,
    AptosWalletAdapter,
    FewchaWalletAdapter,
    WalletProvider,
    PontemWalletAdapter,
    SpikaWalletAdapter,
    FletchWalletAdapter,
    AptosSnapAdapter,
    NightlyWalletAdapter,
    BitkeepWalletAdapter,
    TokenPocketWalletAdapter,
    BloctoWalletAdapter,
    WalletAdapterNetwork,
    Coin98WalletAdapter,
    FoxWalletAdapter,
    OpenBlockWalletAdapter
} from '@manahippo/aptos-wallet-adapter';
import { useMemo } from 'react';
import { message } from 'antd';

function MyApp({ children }: any
) {
    const wallets = useMemo(
        () => [
            // new HippoWalletAdapter(),
            new HippoExtensionWalletAdapter(),
            new MartianWalletAdapter(),
            new AptosWalletAdapter(),
            new FewchaWalletAdapter(),
            new PontemWalletAdapter(),
            new SpikaWalletAdapter(),
            new FletchWalletAdapter(),
            new AptosSnapAdapter(),
            new NightlyWalletAdapter(),
            new BitkeepWalletAdapter(),
            new TokenPocketWalletAdapter(),
            new BloctoWalletAdapter({ network: WalletAdapterNetwork.Testnet, bloctoAppId: '6d85f56e-5f2e-46cd-b5f2-5cf9695b4d46' }),
            new Coin98WalletAdapter(),
            new FoxWalletAdapter(),
            new OpenBlockWalletAdapter()
        ],
        []
    );
    return (
        <WalletProvider
            wallets={wallets}
            onError={(error: Error) => {
                console.log('wallet errors: ', error);
                message.error(error.message);
            }}>
            {children}
        </WalletProvider>
    );
}

export default MyApp;