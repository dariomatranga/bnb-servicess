const services = [
    { name: "Champagne", price: 90 },
    { name: "Prosecco", price: 30 },
    { name: "Mazzo di fiori", price: 50 },
    { name: "Giro in barca per 2 persone", price: 300 }
];

let selectedServices = new Set();

function updateTotal() {
    const total = Array.from(selectedServices).reduce((sum, service) => sum + service.price, 0);
    document.getElementById("total-price").innerText = `€${total.toFixed(2)}`;
}

function renderServices() {
    const list = document.getElementById("services-list");
    services.forEach(service => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${service.name} (€${service.price})</span>
            <input type="checkbox" onchange="toggleService('${service.name}')">
        `;
        list.appendChild(li);
    });
}

function toggleService(name) {
    const service = services.find(s => s.name === name);
    if (selectedServices.has(service)) {
        selectedServices.delete(service);
    } else {
        selectedServices.add(service);
    }
    updateTotal();
}

// Integrazione PayPal
paypal.Buttons({
    createOrder: function(data, actions) {
        // Crea l'ordine PayPal
        const total = Array.from(selectedServices).reduce((sum, service) => sum + service.price, 0);
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: total.toFixed(2)
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        // Conferma del pagamento
        return actions.order.capture().then(function(details) {
            alert('Pagamento completato da ' + details.payer.name.given_name);
        });
    },
    onError: function(err) {
        alert("Si è verificato un errore durante il pagamento: " + err);
    }
}).render('#paypal-button-container'); // Rendi il pulsante PayPal

// Modale per richiesta
function showModal() {
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modal").classList.add("visible");
}

function closeModal() {
    document.getElementById("modal").classList.remove("visible");
    document.getElementById("modal").classList.add("hidden");
}

document.getElementById("close-modal").addEventListener("click", closeModal);

// Inizializza la lista di servizi
renderServices();
