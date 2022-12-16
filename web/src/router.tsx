import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

/**
 * @name Router
 * @description - This is the application router that will have all the app routes!
 * And also some business logic to handle near initialization
 */
function Pages() {
  const { wallets, connect } = useWallet();

  useEffect(() => {
    if (wallets) {
      connect(wallets[1]?.adapter.name);
    }
  }, []);

  return (
    <Routes>
      {routes.map(({ path, component }, idx) => (
        <Route path={path} element={component} key={idx} />
      ))}
    </Routes>
  );
}

export default Pages;
