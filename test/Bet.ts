import {expect} from "chai";
import {ethers} from "hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import type {BigNumber, Signer} from "ethers";
import {Bet__factory, Bet} from "../typechain-types";

describe("Bet", function() {
    let bet: Bet;
    let owner: Signer;
    let otherAccount: Signer;
    beforeEach(async function() {
        [owner, otherAccount] = await ethers.getSigners();
        const Bet: Bet__factory = await ethers.getContractFactory("Bet");
        bet = await Bet.deploy({value: ethers.utils.parseEther("100")});
        await bet.deployed();
    });

    describe("Owner", async function() {
        it("Should be contract owner equal msg.sender", async function() {
            const checkOwner: string = await owner.getAddress();
            const ownerAddress: string = checkOwner.toString();
            const betOwner = await bet.owner();
            expect(ownerAddress).to.be.equal(betOwner.toString());

        });
        describe("RandomNumber", function() {
            let lessThan50: number = 0;
            let greaterThan50: number = 0;

            async function randNum() {
                await bet.roll(54, {value: ethers.utils.parseEther("1")});
                let randomNumber: BigNumber = await bet.randomNumber();
                return Number(randomNumber);
            }

            it(" the number must be repeated no more than 6",
                async function() {
                    const repetitions: Record<string, number> = {};
                    for(let i = 0; i < 1; i++) {
                        let number = await randNum();
                        repetitions[number] = (repetitions[number] || 0) + 1;
                    }
                    const repetitionAmountArr: number[] = Object.values(repetitions);
                    expect(repetitionAmountArr).to.be.not.include(6);
                });
            it("(greaterThan50 - lessThan50) < 25", async function() {
                for(let i = 0; i < 1; i++) {
                    let number = await randNum();
                    if(number < 50) {
                        lessThan50 += 1;
                    } else if(number >= 50) {
                        greaterThan50 += 1;
                    }
                }
                const subtraction: number = greaterThan50 - lessThan50;
                Math.abs(subtraction);
                expect(subtraction).to.be.lessThan(25);
            });
        });
        describe("Withdraw", function() {
            it("Check Withdraw ", async function() {
                const checkOwner: string = await owner.getAddress();
                const ownerAddress: string = checkOwner.toString();
                await expect(bet.connect(owner).withdraw(1)).to.emit(bet, "Withdraw")
                    .withArgs(bet.address, ownerAddress, 1);
            });
            it("only owner", async function() {
                await expect(bet.connect(otherAccount).withdraw(1)).to.be.revertedWith("only owner");
            });
            it("require contract address amount greater than amount", async function() {
                const contractBalance = await ethers.provider.getBalance(bet.address);
                const hugeAmount = String(Number(contractBalance) / 10e16);
                await expect(bet.connect(owner).withdraw(ethers.utils.parseEther(hugeAmount)))
                    .to.be.revertedWith("your amount must be equal contract balance or greater than contract balance");
            });
            describe("resultBet", function() {
                it("msg.sender balance must be greater than 0", async function() {
                    await expect(await bet.connect(otherAccount).resultBet(54, {
                        value: ethers.utils.parseEther("1")
                    })).to.be.not.reverted;
                });
                it("bettor number must be greater than 0", async function() {
                    await expect(bet.connect(otherAccount).roll(0, {
                        value: ethers.utils.parseEther("1")
                    })).to.be.revertedWith("your number must be greater than 0");
                });
                it("bettor number must be smaller than 97", async function() {
                    await expect(bet.connect(otherAccount).roll(97, {
                        value: ethers.utils.parseEther("1")
                    })).to.be.revertedWith("your number must be smaller than 97");
                });
            });
        });
    });

});

