import { ethers } from "hardhat";
import { expect } from "chai";
import { describe } from "mocha";
import { Amm, VRC25 } from "../typechain-types";

describe("VictionAmm", function () {
  let contractApple: VRC25;
  let contractPotato: VRC25;
  let contractAMM: Amm;
  let nonce: number;
  // Create Apple token
  // Create Potato token
  // Initialize liquidity pool
  // Swap

  async function deployContractAmm() {
    const [signer] = await ethers.getSigners();
    const ammContract = await ethers.deployContract("Amm", [], { gasLimit: 4000000, signer, nonce: nonce++ });
    await ammContract.waitForDeployment();
    console.log("Amm deployed to:", ammContract.target);
    return ammContract.target;
  }

  async function deployContractToken() {
    const [signer] = await ethers.getSigners();
    const tokenContract = await ethers.deployContract("MyToken", [], { gasLimit: 4000000, signer, nonce: nonce++ });
    await tokenContract.waitForDeployment();
    console.log("tokenContract deployed to:", tokenContract.target);
    return tokenContract.target;
  }

  it("Before test", async function () {
    const [signer] = await ethers.getSigners();
    nonce = await signer.getNonce();

    const ammAddr = await deployContractAmm();
    const appleAddr = await deployContractToken();
    const potatoAddr = await deployContractToken();
    contractAMM = await ethers.getContractAt("Amm", ammAddr, signer);
    contractApple = await ethers.getContractAt("MyToken", appleAddr, signer);
    contractPotato = await ethers.getContractAt("MyToken", potatoAddr, signer);
  });

  it("Approve", async function () {
    const tx1 = await contractApple.approve(contractAMM.target, 10000, { gasLimit: 4000000 });
    await tx1.wait();
    const tx2 = await contractPotato.approve(contractAMM.target, 10000, { gasLimit: 4000000 });
    await tx2.wait();
  });

  it("Initialize liquidity", async function () {
    const tx = await contractAMM.initializeLiquidity(contractApple.target, contractPotato.target, 1000, 1000, {
      gasLimit: 4000000,
    });
    await tx.wait();

    expect(await contractAMM.reserveApple())
      .to.equal(await contractAMM.reservePotato())
      .to.equal(1000);
  });

  it("Swap", async function () {
    const [signer] = await ethers.getSigners();
    const prevBalance = await ethers.provider.getBalance(signer.address);
    console.log("prevBalance", prevBalance);

    const tx = await contractAMM.swapPotatoToApple(1000, { gasLimit: 4000000, nonce: nonce++ });
    await tx.wait();
    const appleReserve = await contractAMM.reserveApple();
    const potatoReserve = await contractAMM.reservePotato();
    console.log("appleReserve:", appleReserve);
    console.log("potatoReserve:", potatoReserve);

    const nextBalance = await ethers.provider.getBalance(signer.address);
    console.log("nextBalance", nextBalance);
  });
});
