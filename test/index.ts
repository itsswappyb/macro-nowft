import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { NftMarketplace__factory, TestNft__factory } from "../typechain-types/factories/contracts";
import { NftMarketplace, TestNft } from "../typechain-types/contracts";
import { BigNumber } from "ethers";

const SECONDS_IN_DAY: number = 60 * 60 * 24;
const SECONDS_IN_WEEK: number = 60 * 60 * 24 * 7;

const ONE_ETHER: BigNumber = ethers.utils.parseEther("1");
const FIVE_ETHER: BigNumber = ethers.utils.parseEther("5");

describe("NftMarketplace", () => {
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let charlie: SignerWithAddress;

    let TestNftFactory: TestNft__factory;
    let TestNft: TestNft;

    let NftMarketplaceFactory: NftMarketplace__factory;
    let NftMarketplace: NftMarketplace;

    const TOKEN_ID = 0;

    beforeEach(async () => {
        [deployer, alice, bob, charlie] = await ethers.getSigners();

        TestNftFactory = await ethers.getContractFactory("TestNft");
        TestNft = await TestNftFactory.deploy();

        NftMarketplaceFactory = await ethers.getContractFactory("NftMarketplace");
        NftMarketplace = await NftMarketplaceFactory.deploy();
        await NftMarketplace.deployed();
        await TestNft.deployed();

        await TestNft.mintNft(deployer.address);
        await TestNft.approve(NftMarketplace.address, TOKEN_ID);
    });

    it("should deploy", async () => {
        expect(NftMarketplace.address).to.be.ok;
        expect(TestNft.address).to.be.ok;
    });

    it("deployer should have 1 NFT as balance", async () => {
        expect(await TestNft.balanceOf(deployer.address)).to.eq(1);
    });

    describe("listNft", () => {
        it("should revert if non-owner tries to list NFT", async () => {
            await expect(
                NftMarketplace.connect(alice).listNft(
                    TOKEN_ID,
                    TestNft.address,
                    ONE_ETHER.mul(30),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.be.revertedWith("NotOwner");
        });
        it("should list NFT successfully", async () => {
            expect(
                await NftMarketplace.listNft(
                    TOKEN_ID,
                    TestNft.address,
                    ONE_ETHER.mul(30),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.emit(NftMarketplace, "ItemListed");
        });
        it("should revert if NFT is already listed", async () => {
            await NftMarketplace.listNft(
                TOKEN_ID,
                TestNft.address,
                ONE_ETHER.mul(30),
                SECONDS_IN_WEEK * 4,
                20
            );
            await expect(
                NftMarketplace.connect(bob).listNft(
                    TOKEN_ID,
                    TestNft.address,
                    ONE_ETHER.mul(30),
                    SECONDS_IN_WEEK * 4,
                    20
                )
            ).to.be.revertedWith("NotOwner");
        });
    });
});
