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
  OpenBlockWalletAdapter,
  useWallet,
  RiseWalletAdapter,
} from "@manahippo/aptos-wallet-adapter";
import { useMemo } from "react";

function WalletCtx({ children }: any) {
  const wallets = useMemo(
    () => [
      new MartianWalletAdapter(),
      new AptosWalletAdapter(),
      new PontemWalletAdapter(),
      new RiseWalletAdapter()
    ],
    []
  );
  

  return <WalletProvider wallets={wallets}>{children}</WalletProvider>;
}

export default WalletCtx;
