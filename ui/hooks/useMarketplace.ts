import NftMarketplace from "./NftMarketplace.json";
import TestNft from "./TestNft.json";
import { Contract, ethers } from "ethers";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useEffect } from "react";

const marketplaceAbi = NftMarketplace.abi;
const marketplaceAddress = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
const nftAbi = TestNft.abi;
const nftAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
const ethereum = typeof window !== "undefined" && (window as any).ethereum;

const getMarketplaceContract = (): Contract => {
    // const provider = new ethers.providers.Web3Provider(ethereum);
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    return new ethers.Contract(marketplaceAddress, marketplaceAbi, signer);
};

const getNftContract = (): Contract => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(nftAddress, nftAbi, signer);
};

const useMarketplace = () => {
    const { address, isConnected } = useAccount();

    const marketplaceContract = getMarketplaceContract();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { disconnect } = useDisconnect();

    const mintNft = async (to: string) => {
        try {
            const contract = getNftContract();
            await contract.mintNft(to);
            console.log("inside mintNft");
        } catch (err) {
            console.log(err);
        }
    };

    const getTokenUri = async (tokenId: number) => {
        try {
            const contract = getNftContract();
            const tokenUri = await contract.tokenURI(tokenId);
            console.log("tokenUri: ", tokenUri);
            return tokenUri;
        } catch (err) {
            console.log(err);
        }
    };

    return { mintNft, getTokenUri };
};

export default useMarketplace;
