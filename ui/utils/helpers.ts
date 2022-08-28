import { BigNumber, ethers } from "ethers";

export const currentTimestampInSeconds = Math.round(Date.now() / 1000);
export const SECONDS_IN_DAY: number = 60 * 60 * 24;
export const SECONDS_IN_WEEK: number = 60 * 60 * 24 * 7;
export const ONE_ETHER: BigNumber = ethers.utils.parseEther("1");
export const FIVE_ETHER: BigNumber = ethers.utils.parseEther("5");
