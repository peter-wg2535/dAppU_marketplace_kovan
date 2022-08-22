const { ethers ,run, network } = require("hardhat");



async function main() {

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace deployed to " +marketplace .address + " on "+network.name);


  //npx hardhat verify --network  rinkeby 0x83e3F674a22EFA1E995b85Ef4199b754c5b90E03 1000000 1 0xc778417E063141139Fce010982780140Aa0cD5Ab 0x4aAded56bd7c69861E8654719195fCA9C670EB45 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e  900
  //npx hardhat verify --network  kovan 0x7cDFFeB265bca95e3230596e178995828607CcCF
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
