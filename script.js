onload = function() {
    let ids = JSON.parse(localStorage.getItem("ids"));
    if (ids.length) {
        for (id of ids) {
            for (product of products) {
                if (id == product.id) {
                    product.isInCart = true;
                    product.quantity = 1;
                    showItems(id);
                    document.querySelector("#items").textContent = cartItems();
                    document.querySelector("#price").textContent = calcPrice();
                }
            }
        }
    }
}
init(products);

function init(array) {
    const element = document.querySelector('#products');
    const button = document.querySelector('#cart');
    button.addEventListener('click', cartView);
    element.textContent = '';
    for (product of array) {
        const card = document.createElement('div');
        const title = document.createElement('h2');
        const descr = document.createElement('p');
        const price = document.createElement('span');
        const button = document.createElement('button');
        const sprite = document.createElement('img');

        sprite.width = 100;
        sprite.height = 100;


        sprite.src = product.sprite;
        card.className = 'card';
        button.addEventListener('click', addToCart);
        button.setAttribute('key', product.id);

        title.textContent = product.name;
        descr.textContent = product.description;
        price.textContent = product.price + '$';
        button.textContent = 'add to cart';


        card.append(sprite, title, descr, price, button);
        element.append(card);
    }
}

function setValue() {
    let idArray = [];
    for (product of products) {
        if (product.isInCart) {
            idArray.push(product.id);
        }
    }
    localStorage.setItem("ids", JSON.stringify(idArray));
}

function addToCart(e) {
    const key = e.path[0].getAttribute("key");
    for (product of products) {
        if (product.id == key) {
            if (product.isInCart) {
                // product.quantity += 1;
                document.querySelector('.field').value = product.quantity;
                document.querySelector('#price').textContent = calcPrice();
                return false;
            }
            product.isInCart = true;
            product.quantity = 1;
        }
    }
    setValue();
    showItems(key);
    document.querySelector('#price').textContent = calcPrice();
    document.querySelector('#items').textContent = cartItems();
}

function returnPrice(key) {
    for (product of products) {
        if (product.isInCart && product.quantity >= 1 && product.id == key) {
            return (product.quantity * product.price).toFixed(2);
        }
    }
}

function showItems(key) {
    const element = document.querySelector('.block');
    for (product of products) {
        if (product.isInCart && key == product.id) {
            const div = document.createElement('div');
            const container = document.createElement('div');
            const h3 = document.createElement('h3');
            const descr = document.createElement('span');
            const price = document.createElement('h5');
            const button = document.createElement('button');
            const field = document.createElement('input');
            const sprite = document.createElement('img');
            const containerText = document.createElement('article');


            sprite.width = 50;
            sprite.height = 50;

            sprite.src = product.sprite;

            button.setAttribute('key', product.id);
            field.setAttribute('key', product.id);
            field.className = 'field';
            div.className = 'flex';
            button.className = 'btn-remove';
            container.className = 'flex spc';
            containerText.className = 'flex spc';
        
            field.value = product.quantity;
            button.textContent = 'remove';
            h3.textContent = product.name;
            descr.textContent = product.description;
            price.textContent = product.price * product.quantity;
            
            containerText.append(h3, descr);
            container.append(price, field, button);
            div.append(sprite,containerText,container);
            element.append(div);
            button.addEventListener('click', removeItem);
            field.addEventListener('change', handleQuantity);
        }
    }
}

function handleQuantity(e) {
    const key = e.path[0].getAttribute('key');
    const previous = e.path[0].previousElementSibling;
    for (product of products) {
        if (product.id == key && product.isInCart) {
            product.quantity = parseInt(e.path[0].value) || 1;
            document.querySelector('#price').textContent = calcPrice();
            previous.textContent = returnPrice(key);
        }
    }
}

function cartView() {
    const element = document.querySelector('.block');
    const secondElement = document.querySelector('.element');
    element.classList.toggle('none');
    const array = Array.from(element.childNodes);
    for (value of array) {
        if (value.nodeName === '#text') {
            array.splice(array.indexOf(value), 1);
        }
    }
    document.querySelector('#close').addEventListener('click', function(){
        if (!element.classList.contains('none')) {
            element.classList.add('none');
            secondElement.classList.add('none');
        }
    })
}
function removeId(key) {
    let ids = JSON.parse(localStorage.getItem("ids"));
    for (id of ids) {
        if (id === key) {
            ids.splice(ids.indexOf(id), 1);
        }
    }
    localStorage.setItem("ids", JSON.stringify(ids));
}
function removeItem(e) {
    const key = e.path[0].getAttribute("key");
    const container = e.path[2];
    for (product of products) {
        if (product.id == key && product.isInCart) {
            product.isInCart = false;
            document.querySelector('#items').textContent = cartItems();
            document.querySelector('#price').textContent = calcPrice();
            container.classList.add('animate')
            container.addEventListener('animationend', function() {
                this.remove();
            })
        }
    }
    removeId(parseInt(key));
}

function cartItems() {
    let items = products.filter(product => {
        if (product.isInCart) {
            return product;
        }
    })
    return items.length;
}

function calcPrice() {
    let total = 0;
    for (product of products) {
        if (product.isInCart) {
            const {price, quantity} = product;
            total += price * quantity;
            console.log(product);
            console.log(total);
        }
    }
    return total.toFixed(2);
}
createCategory();
function createCategory() {
    let categories = [];
    for (product of products) {
        const {category} = product;
        categories.push(category);
    }
    // console.log(new Set(unique));
    // unique = new Set([...categories]);
    let unique = categories.filter((category, index) => {
        return categories.indexOf(category) === index;
    })
    unique.push('all')
    for (value of unique) {
        const label = document.createElement('label');
        const fields = document.createElement('input');
        const container = document.createElement('div');

        fields.setAttribute('key', value);
        fields.setAttribute('type', 'radio');
        fields.setAttribute('name', 'items');
        fields.id = value;

        label.setAttribute('for', value);
        label.textContent = value;

        container.append(fields, label);
        document.querySelector('#search').append(container);
        fields.addEventListener('change', searchCategory);
    }
}
function searchCategory(e) {
    const key = e.path[0].getAttribute('key');
    if (key === 'all') {
        return init(products);
    }
    let search = products.filter(v => {
        return v.category === key;
    })
    init(search)
}