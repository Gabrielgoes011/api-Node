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

// Teste de conexão ao iniciar (removido para evitar erros desnecessários - o pool conecta automaticamente)
console.log('🔄 Pool de conexões PostgreSQL configurado. Conexões serão estabelecidas conforme necessário.');

// Função wrapper para manter compatibilidade com o código que usa openDb()
export async function openDb() {
    return pool;
}

// Exportamos o pool para ser usado nos controllers
export { pool };