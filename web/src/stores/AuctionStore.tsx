import create from "zustand";

export const useAuctionStore = create<{
    getAuctions(
        loading: boolean,
        account: string,
        connection: any,
    ): Promise<any>
}>(() => ({

    async getAuctions(loading, account, connection) {


    }


}))
