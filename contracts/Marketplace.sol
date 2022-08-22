pragma solidity ^0.8.7;
import "hardhat/console.sol";
contract Marketplace {
    uint256 private productCount = 0;
    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        bool purchased;
    }
    mapping(uint256 => Product) private product;

    event ProdudctCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased,
        uint256 timestamp
    );
    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased,
        uint256 timestamp
    );
    function getProductCount() public view returns(uint256){
        return productCount;
    }
    function getProduct(uint256 id) public view returns(Product memory){
        return product[id];
    }

    function createProduct(string memory _name, uint256 _price) public {
        require(
            bytes(_name).length > 0,
            "prudct name must have  at least 1 character."
        );
        require(_price > 0, "product price must be greater than 0");
        // increase product id
        productCount = productCount+1;
        // add product info
        product[productCount] = Product(
            productCount,
            _name,
            _price,
            payable (msg.sender),
            false
        );
        // log transaction to blockchain
        emit ProdudctCreated(
            productCount,
            _name,
            _price,
            payable (msg.sender),
            false,
            block.timestamp
        );

        console.log("Added product id = %s",productCount);
    }

    function purchaseProduct(uint256 _id) public payable {
        require(_id > 0 && _id <= productCount, "Not found this product id.");

        // get product by id ( id is increasding number) select * from product where product_key=_id
        Product memory product_to_buy = product[_id]; // get single item by id
        
        require(
            msg.value == product_to_buy.price,
            "Amount to pay must be equal to product price exactly."
        );
        require(
            !product_to_buy.purchased,
            "Product havs been not purchased."
        );

        address payable _seller = product_to_buy.owner;
        require(
            _seller != msg.sender,
            "Not allow buyer is the same as seller."
        );

        // if all validation is ok then date product is update
        product_to_buy.owner =payable(msg.sender);
        product_to_buy.purchased = true;
        product[_id] = product_to_buy;

        // transfer ether to prev seller
        payable(_seller).transfer(msg.value);

        // log purchasing transaction to block chain
        emit ProductPurchased(
            productCount,
            product_to_buy.name,
            product_to_buy.price,
            payable(msg.sender),
            true,
            block.timestamp
        );
        console.log('Purchased product id = ',_id);
    }
}
