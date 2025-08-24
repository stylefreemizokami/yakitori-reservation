import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT 1 + 1 AS result');
    await conn.end();
    res.status(200).json({ success: true, result: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}