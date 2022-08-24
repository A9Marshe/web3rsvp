const hre = require("hardhat");

const main = async () => {
  const rsvpContractFactory = await hre.ethers.getContractFactory("Web3RSVP");
  const rsvpContract = await rsvpContractFactory.deploy();
  try {
    await rsvpContract.deployed();
  } catch (err) {
    console.error("GOT ERROR HERHEHRHERHHE!: ", err);
  }
  console.log("Contract deployed to:", rsvpContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
