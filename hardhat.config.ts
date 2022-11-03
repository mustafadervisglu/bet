import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ganache";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import * as dotenv from "dotenv";

dotenv.config();
const HARDHAT = process.env.HARDHAT;
const BNB_RPC_URL = process.env.BNB_RPC_URL;
const PRIVATE_KEY: any = process.env.PRIVATE_KEY;
const GOERLI_RPC_URL = process.env.ETH_GOERLI_RPC_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    gasReporter: {
        enabled: true,
        currency: "USD"
    },
    contractSizer: {
        alphaSort: true,
        disambiguatePaths: false,
        runOnCompile: true,
        strict: true
    },
    networks: {
        localhost: {
            url: HARDHAT,
            chainId: 31337
        },
        goerli: {
            url: GOERLI_RPC_URL,
            chainId: 5,
            accounts: [PRIVATE_KEY]
        },
        bnb: {
            url: BNB_RPC_URL,
            chainId: 97,
            accounts: [PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY
    },
    solidity: "0.8.17"
};

export default config;
