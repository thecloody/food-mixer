const canvas = document.getElementById("plateCanvas");
const ctx = canvas.getContext("2d");
const images = document.querySelectorAll(".food-image");
let foodItems = []; // Lista de ingredientes en el canvas

// Permitir arrastrar imágenes
images.forEach(img => {
    img.setAttribute("draggable", "true"); // Asegurar que las imágenes sean arrastrables
    img.addEventListener("dragstart", function(event) {
        event.dataTransfer.setData("text", event.target.src); // Guardar el src de la imagen arrastrada
        event.dataTransfer.setData("alt", event.target.alt); // Guardar el nombre del ingrediente
    });
});

// Permitir soltar imágenes en el canvas
canvas.addEventListener("dragover", function(event) {
    event.preventDefault();
});

canvas.addEventListener("drop", function(event) {
    event.preventDefault();

    const src = event.dataTransfer.getData("text");
    const alt = event.dataTransfer.getData("alt");

    if (src) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - 50;
        const y = event.clientY - rect.top - 50;
        const img = new Image();
        img.src = src;
        img.alt = alt;
        
        img.onload = function() {
            ctx.drawImage(img, x, y, 100, 100);
            foodItems.push({ ingredient: alt });
        };
    }
});

// Limpiar el canvas
function clearPlate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    foodItems = [];
}

// Descargar la imagen del canvas
function downloadPlate() {
    const link = document.createElement("a");
    link.download = "plato_mezclado.png";
    link.href = canvas.toDataURL();
    link.click();
}

// Fusionar los ingredientes en el canvas
function mergeFoods() {
    const fusionRules = [
        { ingredients: ["pan", "queso", "huevo"], fusionImage: "fusion3.png" },
        { ingredients: ["pan", "lechuga", "tomate", "queso"], fusionImage: "fusion1.png" },
        { ingredients: ["lechuga", "tomate", "pollo"], fusionImage: "fusion2.png" }
    ];

    const currentIngredients = foodItems.map(item => item.ingredient); // Obtener los ingredientes actuales en el canvas

    let fusionFound = false;

    fusionRules.forEach(fusion => {
        if (fusion.ingredients.every(ing => currentIngredients.includes(ing)) &&
            fusion.ingredients.length === currentIngredients.length) {

            clearPlate(); // Limpiar antes de dibujar la fusión

            const fusionImage = new Image();
            fusionImage.src = `images/${fusion.fusionImage}`;
            
            fusionImage.onload = function() {
                ctx.drawImage(fusionImage, 100, 100, 300, 300);
                addLogro(fusion.fusionImage.replace('.png', '').replace(/_/g, ' '));
            };

            fusionFound = true;
        }
    });

    if (!fusionFound) {
        alert("No hay una fusión válida con los ingredientes seleccionados.");
    }
}

// Agregar logros
function addLogro(fusionName) {
    const logrosList = document.getElementById("logrosList"); // Corregido el id
    const newLogro = document.createElement("li");
    newLogro.textContent = fusionName;

    // Evitar logros duplicados
    const logros = Array.from(logrosList.children).map(li => li.textContent);
    if (!logros.includes(fusionName)) {
        logrosList.appendChild(newLogro);
    }
}

// Asignar evento al botón de fusión
document.getElementById("fusionButton").addEventListener("click", mergeFoods);
