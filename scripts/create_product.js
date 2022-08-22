const { ethers} = require("hardhat")
const prompt = require("prompt-sync")();
const  marketplace_JSON=require("../artifacts/contracts/Marketplace.sol/Marketplace.json")
const abi = marketplace_JSON.abi

// npx hardhat node   url: 'http://localhost:8545'
// 0x5FbDB2315678afecb367f032d93F642f64180aa3
//const provider = new ethers.providers.JsonRpcProvider();
//const contract_address="0x5FbDB2315678afecb367f032d93F642f64180aa3"  // localhost
//const acc0_private_ley="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"


// run on testnet kovan
const provider = new ethers.providers.InfuraProvider("kovan",process.env.KOVAN_API_ID)
const contract_address= process.env.KOVAN_MARKET_CONTRACT_ADDRESS
const acc0_private_key=process.env.PRIVATE_KEY

let product_name=""
let product_price=""


const seller_wallet = new ethers.Wallet(acc0_private_key,provider);
//const seller_wallet =  provider.getSigner(); // get index=0   // for hardhat node
const creatable=false

async function main() {
    try {
      console.log("Create product by seller")
      console.log("Address "+await seller_wallet.getAddress())
      console.log("ETH Balance " + ethers.utils.formatEther(await seller_wallet.getBalance()))
     
      const marketplace = new ethers.Contract(contract_address, abi,seller_wallet ) 
     if (creatable){


      console.log("======================Creating product.=====================")

      const param_name = prompt("Enter Product Name ? : ")
      product_name=param_name
      const param_price = prompt("Enter Product Price (Eth) ? : ")
      console.log("Procut Name  " +product_name +" -  " +param_price +" eth")
      const param_y = prompt("Press y to add product :  ");
      if (param_y=='y'){
        product_price=ethers.utils.parseEther(param_price.toString())
        if (product_name && (product_price>0) ){
            // createProduct(string memory _name, uint256 _price)
            const txCreateProduct=await marketplace.createProduct(product_name, product_price)
            await txCreateProduct.wait() 
            console.log(txCreateProduct)
            console.log("Create product successuflly.")
            console.log("=====================Created product successuflly.==================")
        }

      }


     }
    
   
      

        console.log("======================List product info.=====================")
        const product_count=await marketplace.getProductCount()
        console.log("The number of products in system :"+product_count)
        
        for (let id = 1; id <= product_count; id++) {
          const product_detail=await marketplace.getProduct(id)
          if (product_detail.id >0){
            console.log("ID: "+ethers.utils.formatUnits(product_detail.id,0))
            console.log("Name: "+product_detail.name+" , Price: "+ethers.utils.formatEther(product_detail.price)+" eth")
            console.log("Owner: "+product_detail.owner+" , Is Purchased : "+product_detail.purchased)
            
            console.log("**********************************************************************")
          }
          else{
                
            console.log("not found proudct of this id")
          }
          
        }


     }
     
   catch (error) {
        console.log(error.toString())
    }
    
  }
  
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  

