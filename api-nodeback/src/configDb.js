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
    ssl: true // Obrigatório para conexão com Neon (PostgreSQL na nuvem)
});

// Teste de conexão ao iniciar (opcional, mas bom para debug)
pool.connect()
    .then(() => console.log('✅ Conectado ao PostgreSQL com sucesso!'))
    .catch(err => console.error('❌ Erro ao conectar no PostgreSQL:', err));

// Função wrapper para manter compatibilidade com o código que usa openDb()
export async function openDb() {
    return pool;
}

// Exportamos o pool para ser usado nos controllers
export { pool };