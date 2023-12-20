import { ethers } from "hardhat";
import { Amm, VRC25 } from "../typechain-types";

describe("Amm", function () {
  let apple: VRC25;
  let potato: VRC25;
  let amm: Amm;
  async function getRequestOptions() {
    const [signer] = await ethers.getSigners();
    return {
      gasLimit: 4000000,
      signer,
      nonce: await signer.getNonce(),
    };
  }

  it("Deploy contract AMM", async function () {
    // const ammContract = await ethers.deployContract("Amm", [], await getRequestOptions());
    // await ammContract.waitForDeployment();
    // amm = await ethers.getContractAt("Amm", ammContract.target);
    // console.log("Amm address", ammContract.target);

    amm = await ethers.getContractAt("Amm", "0x900AFE8eEC32f15f551Fa7266CAB22b54435b4c9");
  });

  it("Deploy contract Apple", async function () {
    // const appleContract = await ethers.deployContract("MyToken", [], await getRequestOptions());
    // await appleContract.waitForDeployment();
    // apple = await ethers.getContractAt("MyToken", appleContract.target);
    // console.log("Apple address", appleContract.target);

    apple = await ethers.getContractAt("MyToken", "0x5583a0D8c6095cD0C29c3886ae9A2E59d0d800Ea");
  });

  it("Deploy contract Potato", async function () {
    // const potatoContract = await ethers.deployContract("MyToken", [], await getRequestOptions());
    // await potatoContract.waitForDeployment();
    // potato = await ethers.getContractAt("MyToken", potatoContract.target);
    // console.log("Potato address", potatoContract.target);

    potato = await ethers.getContractAt("MyToken", "0x704B891134CE9B5bAe0C062b516C9cBd65E40E4b");
  });

  // TODO: Approve Apple
  // it("Approve Apple", async function () {
  //   const tx = await apple.approve(amm.target, 10000, await getRequestOptions());
  //   await tx.wait();
  // });

  // TODO: Approve Potato
  // it("Approve Potato", async function () {
  //   const tx = await potato.approve(amm.target, 10000, await getRequestOptions());
  //   await tx.wait();
  // });

  // it("Initialize Liquidity", async function () {
  //   const tx = await amm.initializeLiquidity(
  //     apple.target,
  //     potato.target,
  //     1000,
  //     1000,
  //     await getRequestOptions()
  //   );
  //   await tx.wait();

  //   const reserveApple = await amm.reserveApple();
  //   console.log("reserveApple", reserveApple);
  //   const reservePotato = await amm.reservePotato();
  //   console.log("reservePotato", reservePotato);
  // });

  it("Swap Potato to Apple", async function () {
    const [signer] = await ethers.getSigners();
    const prevBalance = await ethers.provider.getBalance(signer.address);
    console.log("prevBalance", prevBalance);

    const tx = await amm.swapPotatoToApple(100, await getRequestOptions());
    await tx.wait();

    const reserveApple = await amm.reserveApple();
    console.log("reserveApple", reserveApple);
    const reservePotato = await amm.reservePotato();
    console.log("reservePotato", reservePotato);

    const nextBalance = await ethers.provider.getBalance(signer.address);
    console.log("nextBalance", nextBalance);
  });
});
