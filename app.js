const services = [
    { name: "Champagne", price: 90, img: "images/champagne.jpg" },
    { name: "Prosecco", price: 30, img: "images/prosecco.jpg" },
    { name: "Mazzo di fiori", price: 50, img: "images/flowers.jpg" },
    { name: "Giro in barca per 2 persone", price: 300, img: "images/boat.jpg" }
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
            <img src="${service.img}" alt="${service.name}">
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

paypal.Buttons({
    createOrder: function(data, actions) {
        const total = Array.from(selectedServices).reduce((sum, service) => sum + service.price, 0);
        return actions.order.create({
            purchase_units: [{
                amount: { value: total.toFixed(2) }
            }]
        });
    },
    onApprove: function(data, actions) {
        alert("Grazie per la tua richiesta! Ti contatteremo entro 24 ore per confermare.");
    },
    onError: function(err) {
        alert("Errore durante il pagamento: " + err);
    }
}).render('#paypal-button-container');

renderServices();
