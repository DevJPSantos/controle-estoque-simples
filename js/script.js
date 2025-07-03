const itemNameInput = document.getElementById('itemName');
const itemQuantityInput = document.getElementById('itemQuantity');
const itemPriceInput = document.getElementById('itemPrice');
const addItemBtn = document.getElementById('addItemBtn');
const updateItemBtn = document.getElementById('updateItemBtn');
const clearFormBtn = document.getElementById('clearFormBtn');
const searchItemInput = document.getElementById('searchItem');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const noItemsMessage = document.getElementById('noItemsMessage');

const customModal = document.getElementById('customModal');
const modalMessage = document.getElementById('modalMessage');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');

let inventory = []; 
let editingItemId = null;

function generateUniqueId() {
    
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}


function saveInventory() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}


function loadInventory() {
    const storedInventory = localStorage.getItem('inventory');
    if (storedInventory) {
        inventory = JSON.parse(storedInventory);
    }
    renderInventory(); 
}


function renderInventory() {
    inventoryTableBody.innerHTML = ''; 
    const searchTerm = searchItemInput.value.toLowerCase();
    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
    );

    if (filteredInventory.length === 0) {
        noItemsMessage.classList.remove('hidden');
        return;
    } else {
        noItemsMessage.classList.add('hidden');
    }

    filteredInventory.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td data-label="ID">${item.id.substring(0, 8)}...</td>
            <td data-label="Nome">${item.name}</td>
            <td data-label="Quantidade">${item.quantity}</td>
            <td data-label="Preço">R$ ${item.price.toFixed(2)}</td>
            <td data-label="Ações" class="actions-cell">
                <button class="btn btn-primary btn-small" onclick="editItem('${item.id}')">Editar</button>
                <button class="btn btn-danger btn-small" onclick="showDeleteModal('${item.id}')">Excluir</button>
            </td>
        `;
        inventoryTableBody.appendChild(row);
    });
}


function addItem() {
    const name = itemNameInput.value.trim();
    const quantity = parseInt(itemQuantityInput.value);
    const price = parseFloat(itemPriceInput.value);

    
    if (!name || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        showModal('Por favor, preencha todos os campos corretamente (quantidade e preço devem ser números positivos).');
        return;
    }

    const newItem = {
        id: generateUniqueId(),
        name: name,
        quantity: quantity,
        price: price
    };

    inventory.push(newItem);
    saveInventory();
    clearForm();
    renderInventory();
    showModal('Item adicionado com sucesso!');
}


function editItem(id) {
    const itemToEdit = inventory.find(item => item.id === id);
    if (itemToEdit) {
        itemNameInput.value = itemToEdit.name;
        itemQuantityInput.value = itemToEdit.quantity;
        itemPriceInput.value = itemToEdit.price;
        addItemBtn.classList.add('hidden'); 
        updateItemBtn.classList.remove('hidden'); 
        editingItemId = id; 
    }
}


function updateItem() {
    if (!editingItemId) return; 

    const name = itemNameInput.value.trim();
    const quantity = parseInt(itemQuantityInput.value);
    const price = parseFloat(itemPriceInput.value);

    
    if (!name || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
        showModal('Por favor, preencha todos os campos corretamente para atualizar.');
        return;
    }

    const itemIndex = inventory.findIndex(item => item.id === editingItemId);
    if (itemIndex > -1) { 
        inventory[itemIndex] = {
            ...inventory[itemIndex], 
            name: name,
            quantity: quantity,
            price: price
        };
        saveInventory();
        clearForm();
        renderInventory();
        showModal('Item atualizado com sucesso!');
    }
}


function showDeleteModal(id) {
    modalMessage.textContent = 'Tem certeza que deseja excluir este item?';
    customModal.classList.add('show');
    
    modalConfirmBtn.onclick = () => {
        deleteItem(id);
        hideModal(); 
    };
    
    modalCancelBtn.onclick = hideModal;
}


function deleteItem(id) {
    inventory = inventory.filter(item => item.id !== id); 
    saveInventory();
    renderInventory();
    showModal('Item excluído com sucesso!');
}


function clearForm() {
    itemNameInput.value = '';
    itemQuantityInput.value = '';
    itemPriceInput.value = '';
    addItemBtn.classList.remove('hidden'); 
    updateItemBtn.classList.add('hidden'); 
    editingItemId = null; 
}


function showModal(message, isConfirmation = false) {
    modalMessage.textContent = message;
    if (isConfirmation) {
        modalCancelBtn.classList.remove('hidden');
        modalConfirmBtn.classList.remove('hidden');
        modalConfirmBtn.textContent = 'Confirmar'; 
    } else {
        modalCancelBtn.classList.add('hidden'); 
        modalConfirmBtn.textContent = 'OK'; 
        modalConfirmBtn.onclick = hideModal; 
        modalConfirmBtn.classList.remove('hidden');
    }
    customModal.classList.add('show');
}


function hideModal() {
    customModal.classList.remove('show');
    
    modalConfirmBtn.textContent = 'Confirmar';
    modalCancelBtn.classList.remove('hidden');
}


addItemBtn.addEventListener('click', addItem);
updateItemBtn.addEventListener('click', updateItem);
clearFormBtn.addEventListener('click', clearForm);
searchItemInput.addEventListener('input', renderInventory); 


customModal.addEventListener('click', (e) => {
    if (e.target === customModal) { 
        hideModal();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && customModal.classList.contains('show')) {
        hideModal();
    }
});

document.addEventListener('DOMContentLoaded', loadInventory);
