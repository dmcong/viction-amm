import { ethers } from "hardhat";
import { expect } from "chai";
import { describe } from "mocha";
import { Amm, VRC25 } from "../typechain-types";

describe("VictionAmm", function () {
  let apple: VRC25;
  let potato: VRC25;
  let amm: Amm;

  async function getTxRequestOption() {
    const [signer] = await ethers.getSigners();
    return { nonce: await signer.getNonce(), gasLimit: 4000000, signer };
  }

  async function deployContractAmm() {
    const ammContract = await ethers.deployContract("Amm", [], await getTxRequestOption());
    await ammContract.waitForDeployment();
    console.log("Amm deployed to:", ammContract.target);
    return ammContract.target;
  }

  async function deployContractToken() {
    const tokenContract = await ethers.deployContract("MyToken", [], await getTxRequestOption());
    await tokenContract.waitForDeployment();
    console.log("tokenContract deployed to:", tokenContract.target);
    return tokenContract.target;
  }

  it("Deploy AMM", async function () {
    const ammAddr = await deployContractAmm();
    amm = await ethers.getContractAt("Amm", ammAddr);
  });

  it("Deploy Apple", async function () {
    const appleAddr = await deployContractToken();
    apple = await ethers.getContractAt("MyToken", appleAddr);
  });

  it("Deploy Potato", async function () {
    const potatoAddr = await deployContractToken();
    potato = await ethers.getContractAt("MyToken", potatoAddr);
  });

  it("Approve Apple & Potato", async function () {
    const tx1 = await apple.approve(amm.target, 10000, await getTxRequestOption());
    await tx1.wait();
    const tx2 = await potato.approve(amm.target, 10000, await getTxRequestOption());
    await tx2.wait();
  });

  it("Initialize liquidity", async function () {
    const tx = await amm.initializeLiquidity(apple.target, potato.target, 1000, 1000, await getTxRequestOption());
    await tx.wait();

    expect(await amm.reserveApple()).to.equal(1000);
    expect(await amm.reservePotato()).to.equal(1000);
  });

  it("Swap", async function () {
    const tx = await amm.swapPotatoToApple(10, await getTxRequestOption());
    await tx.wait();

    expect(await amm.reserveApple()).to.equal(990n);
    expect(await amm.reservePotato()).to.equal(1010n);
  });
});
