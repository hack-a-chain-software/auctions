import { useWeb3 } from "@fewcha/web3-react";
import { ConnectWallet } from "@fewcha/web3-react";
// in your React component:



/**
 * @route - '/'
 * @description - This is the landing page for the near application
 * @name Home
 */
export function Home() {
  const web3 = useWeb3();
  const { account, balance, isConnected, disconnect, network } = web3;

  return (
    <>
      <div>
        {isConnected ? (
          <div>
            <div>Address: {account.address}</div>
            <div>Balance: {balance || "0"}</div>
            <div>Network: {network}</div>
            <div>
              <button
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <ConnectWallet type="list" />
        )}
      </div>
    </>
  );
}
