require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: process.env.STAGING_ALCHEMY_URL,
      accounts: [`0x${process.env.STAGING_PRIVATE_KEY}`],
      gas: 2100000000,
      gasPrice: 80000000000,
    },
  },
};
