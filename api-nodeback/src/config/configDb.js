import pkg from 'pg';
import 'dotenv/config'; // Carrega as variáveis do .env automaticamente

const { Pool } = pkg;


// Cria um pool de conexões usando as variáveis do .env
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }, // Ajuste para SSL sem rejeitar certificados não autorizados
    idleTimeoutMillis: 30000, // Fecha conexões ociosas após 30s
    connectionTimeoutMillis: 2000, // Timeout de conexão de 2s
});

// Testa a conexão com um pequeno atraso para as mensagens do servidor aparecerem primeiro
setTimeout(() => {
    (async () => {
        // Verifica as variáveis de ambiente aqui para o erro sair no lugar certo
        if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_NAME) {
            console.error('❌ ERRO: Variáveis de ambiente ausentes!');
            return; // Para a execução e não tenta conectar
        }

        try {
            const client = await pool.connect();
            console.log('✅ Banco de dados PostgreSQL conectado com sucesso!');
            client.release(); // Libera a conexão de volta para o pool
        } catch (error) {
            console.error('❌ Falha ao conectar ao banco de dados PostgreSQL!');
            console.error(`   Motivo: ${error.message}`);
        }
    })();
}, 500); // 500ms de atraso garante que o log do Express passe antes

// Função wrapper para manter compatibilidade com o código que usa openDb()
export async function openDb() {
    return pool;
}

// Exportamos o pool para ser usado nos controllers
export { pool };