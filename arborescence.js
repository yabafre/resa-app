const fs = require('fs');

function displayDirectoryContents(path, indent = 0) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
        if (file === "node_modules" || file === ".idea" || file === ".vscode" || file === "dist" || file === ".next" || file === "resa-app" || file === ".git") {
            // Exclure les dossiers node_modules, .idea et .vscode
            return;
        }
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            console.log(`${" ".repeat(indent)}[${file}]`);
            displayDirectoryContents(filePath, indent + 2);
        } else {
            console.log(`${" ".repeat(indent)}${file}`);
        }
    });
}

// Exemple: afficher l'arborescence du dossier "monDossier"
displayDirectoryContents(".");