import 'dotenv/config.js';
import app from "./src/app.js";

//inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 - Servidor inciado com sucesso!
🛜  - Acesse em http://localhost:${PORT}`);
});