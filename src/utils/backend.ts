import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Option_SOLIDITY, OptionState, OptionFlavor } from "./types";
import { ADDRESS0, SECONDS_IN_A_DAY } from "./constants";
import { BigNumber } from "ethers";
import {
    NFTOptContract,
    deployMainContractLibraries,
    deployMainContract,
    deployNFTCollectionContract,
    contracts,
} from "./deployment";
import { ERC721 } from "../../typechain-types";

export let buyer: SignerWithAddress;
export let seller: SignerWithAddress;
export let nonParticipant: SignerWithAddress;

export let dummyOptionRequest: Option_SOLIDITY;
export let NFTDummyContract: ERC721;

export async function deployHardHatDummyNFTCollection() {
    const name = "NK_NFT";
    await deployNFTCollectionContract(name);

    NFTDummyContract = contracts[name].instance;
    dummyOptionRequest.nftContract = NFTDummyContract.address;
}

export const initializer = async () => {
    const accounts = await ethers.getSigners();

    buyer = accounts[0];
    seller = accounts[1];
    nonParticipant = accounts[3];

    dummyOptionRequest = {
        buyer: buyer.address,
        seller: ADDRESS0,
        nftContract: "",
        nftId: BigNumber.from(1),
        startDate: 0,
        interval: 7 * SECONDS_IN_A_DAY,
        premium: ethers.utils.parseEther("1"),
        strikePrice: ethers.utils.parseEther("50"),
        flavor: OptionFlavor.EUROPEAN,
        state: OptionState.REQUEST,
    };

    await deployMainContractLibraries();
    await deployMainContract();
    await deployHardHatDummyNFTCollection();
};

export let publishDummyOptionRequest = async () => {
    await expect(
        NFTOptContract.connect(buyer).publishOptionRequest(
            dummyOptionRequest.nftContract,
            dummyOptionRequest.nftId,
            dummyOptionRequest.strikePrice,
            dummyOptionRequest.interval,
            dummyOptionRequest.flavor,
            { value: dummyOptionRequest.premium }
        )
    ).to.emit(NFTOptContract, "NewRequest");
};

export async function addDaysToEVM(days: number) {
    await ethers.provider.send("evm_increaseTime", [days * SECONDS_IN_A_DAY]);
    await ethers.provider.send("evm_mine", []);
}
