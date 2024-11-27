const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Ruta del modelo
const modelsDir = path.resolve("public/models");

// Modelos que quieres procesar (puedes agregar más nombres de modelos aquí)
const models = ["image", "sound"];

// Función para calcular el checksum
function calculateChecksum(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    return hashSum.digest("hex");
}

// Generar el archivo version.json para cada modelo
function generateVersionFiles() {
    models.forEach((model) => {
        const modelPath = path.join(modelsDir, model, "model.json");
        const versionPath = path.join(modelsDir, model, "version.json");

        if (fs.existsSync(modelPath)) {
            // Calcular el checksum
            const checksum = calculateChecksum(modelPath);

            // Crear el archivo version.json
            const versionData = { checksum };
            fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

            console.log(`Archivo version.json generado para ${model}: ${checksum}`);
        } else {
            console.warn(`El archivo model.json no existe para el modelo: ${model}`);
        }
    });
}

// Ejecutar la función
generateVersionFiles();
