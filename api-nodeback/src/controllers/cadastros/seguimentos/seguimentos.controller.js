import { openDb } from "../../../config/configDb.js";


export async function contarSeguimentos(req, res) {
  const db = await openDb();
  try {
    const resultadoAtivo = await db.query(`
        SELECT COUNT(id) AS totalSeguimentos
        FROM seguimentos
    `);

    // Retorna a contagem de usuários ativos, inativos e total
    res.status(200).json({
      ativos: resultadoAtivo.rows[0].totalseguimentos,
    });
  } catch (error) {
    console.error('Erro ao contar usuários:', error);
    res.status(500).json({ error: 'Erro ao contar usuários.' });
  }
}
//#endregion