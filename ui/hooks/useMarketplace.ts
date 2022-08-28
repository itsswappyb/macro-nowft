import NftMarketplace from "./NftMarketplace.json";

const marketplaceAbi = NftMarketplace.abi;
const marketplaceAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const ethereum = typeof window !== "undefined" && (window as any).ethereum;

const useMarketplace = () => {};

export default useMarketplace;
