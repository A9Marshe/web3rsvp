const hre = require("hardhat");

const main = async () => {
  //deploying RSVP contract
  const rsvpContractFactory = await hre.ethers.getContractFactory("Web3RSVP");
  const rsvpContract = await rsvpContractFactory.deploy();
  await rsvpContract.deployed();
  console.log("Contract deployed to :", rsvpContract.address);

  //getting relevant addresses
  const [deployer, address1, address2] = await hre.ethers.getSigners();

  //preparing a new event to be created using the smart contract
  let deposit = hre.ethers.utils.parseEther("1");
  let maxCapacity = 3;
  let timestamp = 1718926200;
  let eventDataCID =
    "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";

  //making the transaction
  let txn = await rsvpContract.CreateNewEvent(
    timestamp,
    deposit,
    maxCapacity,
    eventDataCID
  );

  //awaiting transaction completion
  let wait = await txn.wait();

  //logging events emitted after creation
  console.log("NEW EVENT CREATED", wait.events[0].event, wait.events[0].args);
  //logging new event ID for later use by users who want to RSVP
  let eventID = wait.events[0].args.eventID;
  console.log("EVENT ID: ", eventID);

  //making new RSVP using three different addresses `.connect(address)`
  txn = await rsvpContract.createNewRSVP(eventID, { value: deposit });
  wait = await txn.wait();
  console.log("NEW RSVP: ", wait.events[0].event, wait.events[0].args);

  txn = await rsvpContract
    .connect(address1)
    .createNewRSVP(eventID, { value: deposit });
  wait = await txn.wait();
  console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

  txn = await rsvpContract
    .connect(address2)
    .createNewRSVP(eventID, { value: deposit });
  wait = await txn.wait();
  console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

  //confirming all attendess
  txn = await rsvpContract.confirmAllAttendees(eventID);
  wait = await txn.wait();
  wait.events.forEach((event) =>
    console.log("CONFIRMED:", event.args.attendeeAddress)
  );

  //withdrawing unclaimed deposits (sending deposits to the event creator)

  //simulating the passage of time using hardhat as our cotract requires 7 days to pass before being able to withdraw

  //passage of time: wait 10 years
  await hre.network.provider.send("evm_increaseTime", [15778800000000]);

  txn = await rsvpContract.withdrawUnclaimedDeposits(eventID);
  wait = await txn.wait();

  console.log("WITHDRAW:", wait.events[0].event, wait.events[0].args);
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
