const services = [
    { name: "Champagne", price: 90, img: "champagne.jpg" },
    { name: "Prosecco", price: 30, img: "prosecco.jpg" },
    { name: "Mazzo di fiori", price: 50, img: "flowers.jpg" },
    { name: "Giro in barca per 2 persone", price: 300, img: "boat.jpg" }
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
        return actions.order.capture().then(function(details) {
            sendEmail(details);
            showModal();
        });
    },
    onError: function(err) {
        alert("Errore durante il pagamento: " + err);
    }
}).render('#paypal-button-container');

function sendEmail(details) {
    emailjs.init("public_xxxx");

    emailjs.send("service_xxxx", "template_xxxx", {
        name: details.payer.name.given_name,
        email: details.payer.email_address,
        services: Array.from(selectedServices).map(s => s.name).join(", "),
        total: Array.from(selectedServices).reduce((sum, service) => sum + service.price, 0).toFixed(2)
    }).then(() => {
        console.log("Email inviata!");
    }).catch(err => {
        console.error("Errore nell'invio dell'email: ", err);
    });
}

function showModal() {
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modal").classList.add("visible");
}

function closeModal() {
    document.getElementById("modal").classList.remove("visible");
    document.getElementById("modal").classList.add("hidden");
}

document.getElementById("close-modal").addEventListener("click", closeModal);

renderServices();
