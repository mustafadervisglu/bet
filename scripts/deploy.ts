//imports
import {ethers, run, network} from "hardhat";
import type {BigNumber} from "ethers";
import {Bet, Bet__factory} from "../typechain-types";

const CONSTRUCTOR_ADDRESS = process.env.CONSTRUCTOR_ADDRESS;

//async main
async function main() {
    const Bet: Bet__factory = await ethers.getContractFactory("Bet");

    console.log("Deploying Contract...");
    const bet: Bet = await Bet.deploy({value: ethers.utils.parseEther("0.05")});
    await bet.deployed();
    // hardhat generates public key if you don't give any public key
    // console.log(network.config);
    console.log(`Deployed contract to: ${bet.address}`);
    // goerli test network chainId number is 5
    if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        //wait 5 blocks for run verificaiton
        await bet.deployTransaction.wait(5);
        await verify(bet.address, CONSTRUCTOR_ADDRESS);
    }
}

async function verify(address: string, arg: string | undefined) {
    console.log("verifying contract");
    try {
        await run("verify:verify", {
            address: address,
            constructorArgumentsAddress: arg
        });
    } catch(e: any) {
        if(e.message.toLocaleLowerCase().includes("already verified")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
}

//main
main().then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
