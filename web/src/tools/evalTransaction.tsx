import toast from "react-hot-toast"
import { aptosClient } from "../config/aptosClient";

async function evaluateTransactionResult(hash: string) {

    try {
        const transaction = await aptosClient.getTransactionByHash(hash);

        if (transaction?.type == "PendingTransaction") {
            return setTimeout(function () {
                evaluateTransactionResult(hash);
            }, 1000);
        }

        if (transaction?.type == "UserTransaction") {

            toast.success("Transaction Completed!");

            return setTimeout(function () {
                window.location.reload()
            }, 1000);
        }
    } catch (e) {
        return console.error(toast.error(`Transaction failed: ${e}`));
    }
}

export default evaluateTransactionResult;