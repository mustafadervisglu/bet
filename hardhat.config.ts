import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';


dotenv.config();

const BNB_RPC_URL = process.env.BNB_RPC_URL;
const PRIVATE_KEY: any = process.env.PRIVATE_KEY;
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    },
    bnb: {
      url: BNB_RPC_URL,
      chainId: 97,
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: "0.8.17"
};

export default config;
