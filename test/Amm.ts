import { ethers } from "hardhat";
import { describe } from "mocha";

// https://viction.tuphan.dev/

describe("VictionAmm", function () {
  async function deployContractAmm() {
    const [signer] = await ethers.getSigners();
    const ammContract = await ethers.deployContract("Amm", [], {
      gasLimit: 4000000,
      signer,
    });
    await ammContract.waitForDeployment();
    console.log(`AmmContract was deployed to ${ammContract.target}`);
    return ammContract.target;
  }

  async function deployContractToken() {
    const [signer] = await ethers.getSigners();
    const tokenContract = await ethers.deployContract("MyToken", [], {
      gasLimit: 4000000,
      signer,
    });
    await tokenContract.waitForDeployment();
    console.log(`TokenContract was deployed to ${tokenContract.target}`);
    return tokenContract.target;
  }

  it("Should OK", async function () {
    const ammContract = await deployContractAmm();
    const tokenContract = await deployContractToken();
    // TODO: something
  });
});
