const Products = [
    { id: 1, name: 'Product-1', price: 100 },
    { id: 2, name: 'Product-2', price: 200 },
    { id: 3, name: 'Product-3', price: 300 },
];

let shopItems = document.querySelector("#shop-items");

// Map to store the display divs for each product
const productDisplayMap = new Map();

// Display "No products added" text initially
displayNoProductsText();

// Create a button for displaying the total price
const totalButton = document.querySelector('#total-button');
totalButton.addEventListener('click', () => {
    alert(`Total Price: ${getTotalPrice()}`);
});

Products.forEach(product => {
    createProduct(product);
});

function createProduct(product) {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product-container');

    const productNameDiv = document.createElement('div');
    productNameDiv.classList.add('product-name');
    productNameDiv.innerHTML = `<p>${product.name}</p>`;
    productDiv.appendChild(productNameDiv);

    const productPriceDiv = document.createElement('div');
    productPriceDiv.classList.add('product-price');
    productPriceDiv.innerHTML = `<p>${product.price}</p>`;
    productDiv.appendChild(productPriceDiv);

    const calculatedValueDiv = document.createElement('div');
    calculatedValueDiv.classList.add('calculated-value');
    productDiv.appendChild(calculatedValueDiv);

    const subtractButton = createButton('-', -1);
    const addButton = createButton('+', 1);
    const valueParagraph = document.createElement('p');
    valueParagraph.innerText = '0';

    calculatedValueDiv.appendChild(subtractButton);
    calculatedValueDiv.appendChild(valueParagraph);
    calculatedValueDiv.appendChild(addButton);

    function createButton(text, change) {
        const button = document.createElement('button');
        button.classList.add('calc-button');
        button.innerText = text;
        button.addEventListener('click', () => {
            updateCalculatedValue(change);
        });
        return button;
    }

    function updateCalculatedValue(change) {
        let newValue = parseInt(valueParagraph.innerText, 10) + change;
        newValue = Math.max(newValue, 0);
        valueParagraph.innerText = newValue;

        // Call the displayValue function whenever the value is updated
        displayValue(product.name, newValue, product.price);

        // If the value becomes 0, remove the display div
        if (newValue === 0) {
            removeValueDisplay(product.name);
        }

        // Check if any product values are greater than 0
        const anyProductHasValue = Array.from(productDisplayMap.values()).some(displayDiv => {
            const value = parseInt(displayDiv.innerText.split(':')[1].trim(), 10);
            return value > 0;
        });

        // Display or remove "No products added" text based on values
        if (anyProductHasValue) {
            removeNoProductsText();
        } else {
            displayNoProductsText();
        }

        // Update the total price
        updateTotalPrice();
    }

    shopItems.appendChild(productDiv);
}

function displayValue(productName, value, price) {
    const shopCart = document.querySelector("#shop-cart");

    // Calculate the total value for the product (value * price)
    const totalValue = value * price;

    // Check if a div for the product already exists
    if (productDisplayMap.has(productName)) {
        // Update the existing div's content
        const valueDisplayDiv = productDisplayMap.get(productName);
        valueDisplayDiv.innerText = `${productName}:${value} X ${price} = ${totalValue}`;

    } else {
        // Create a new div for the product and store it in the map
        const valueDisplayDiv = document.createElement('div');
        valueDisplayDiv.classList.add('value-display');
        valueDisplayDiv.innerText = `${productName}:${value} X ${price} = ${totalValue}`;
        shopCart.appendChild(valueDisplayDiv);
        productDisplayMap.set(productName, valueDisplayDiv);
    }
}

function removeValueDisplay(productName) {
    const shopCart = document.querySelector("#shop-cart");

    // Check if a div for the product exists
    if (productDisplayMap.has(productName)) {
        // Remove the corresponding div from the shop cart and delete from the map
        const valueDisplayDiv = productDisplayMap.get(productName);
        shopCart.removeChild(valueDisplayDiv);
        productDisplayMap.delete(productName);
    }
}

function displayNoProductsText() {
    const shopCart = document.querySelector("#shop-cart");
    const noProductsText = document.querySelector('.no-products-text');
    
    if (!noProductsText) {
        const newNoProductsText = document.createElement('div');
        newNoProductsText.classList.add('no-products-text');
        newNoProductsText.innerText = 'NO PRODUCT ADDED';
        shopCart.appendChild(newNoProductsText);
    }
}

function removeNoProductsText() {
    const shopCart = document.querySelector("#shop-cart");
    const noProductsText = document.querySelector('.no-products-text');
    
    if (noProductsText) {
        shopCart.removeChild(noProductsText);
    }
}

function updateTotalPrice() {
    const totalButton = document.querySelector('#total-button');
    const total = getTotalAmount();
    totalButton.innerText = `Total: ${total}`;
}

function getTotalAmount() {
    return Array.from(productDisplayMap.values()).reduce((sum, displayDiv) => {
        const value = parseInt(displayDiv.innerText.split(':')[1].trim().split(' X ')[0], 10);
        const price = parseInt(displayDiv.innerText.split('=')[1].trim(), 10);
        return sum + value * price;
    }, 0);
}
