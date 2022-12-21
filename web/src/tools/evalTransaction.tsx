import { toast } from "react-toastify";
import { aptosClient } from "../config/aptosClient";

async function evaluateTransactionResult(hash: string) {
  try {
    const transaction = await aptosClient.getTransactionByHash(hash);

    if (transaction?.type == "pending_transaction") {
      return setTimeout(function () {
        evaluateTransactionResult(hash);
      }, 1000);
    }

    if (transaction?.type == "user_transaction") {
      toast.success("Successful transaction!", {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return setTimeout(function () {
        window.location.reload();
      }, 2000);
    }
  } catch (e) {
    toast.error(`Transaction failed: ${e}`, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    return setTimeout(function () {
      window.location.reload();
    }, 1500);
  }
}

export default evaluateTransactionResult;
