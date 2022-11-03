//imports
import {ethers, run, network} from "hardhat";

//async main
async function main() {
    const Bet = await ethers.getContractFactory("Bet");

    console.log("Deploying Contract...");
    const bet = await Bet.deploy({value: ethers.utils.parseEther("100")});
    await bet.deployed();
    // hardhat generates public key if you don't give any public key
    console.log(network.config);

}

async function verify(address: any, arg: any) {
    console.log("verifying contract");
    await run("verify:verify", {
        address: address,
        constructorArguments: arg
    });
}

//main
main().then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
