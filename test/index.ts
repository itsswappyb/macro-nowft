import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { NftMarketplace__factory } from "../typechain-types/factories/contracts/NftMarketplace__factory";
import { NftMarketplace } from "../typechain-types/contracts";

describe("NftMarketplace", () => {
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let charlie: SignerWithAddress;

    let NftMarketplaceFactory: NftMarketplace__factory;
    let NftMarketplace: NftMarketplace;

    beforeEach(async () => {
        [deployer, alice, bob, charlie] = await ethers.getSigners();
        NftMarketplaceFactory = await ethers.getContractFactory("NftMarketplace");
        NftMarketplace = await NftMarketplaceFactory.deploy();
        await NftMarketplace.deployed();
    });

    it("should deploy", async () => {
        // eslint-disable-next-line no-unused-expressions
        expect(NftMarketplace.address).to.be.ok;
    });
});
