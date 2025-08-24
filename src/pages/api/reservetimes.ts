import type { NextApiRequest, NextApiResponse } from 'next';
import type { RowDataPacket } from 'mysql2/promise';
import { getConnection } from '../../lib/db';

interface TimeSlotRow extends RowDataPacket {
  reservation_hour: number;
  available_seats: number;
  is_full: number; // SQL の CASE は 0/1
}

interface TimeSlot {
  reservation_hour: string;  // number → string
  available_seats: number;
  is_full: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { date } = req.query;

  if (!date || typeof date !== 'string') {
    return res.status(400).json({ error: 'date is required' });
  }

  try {
    const connection = await getConnection();

    // 営業時間11〜21時のリストを LEFT JOIN して残席計算
    const [rows] = await connection.execute<TimeSlotRow[]>(
      `
      SELECT
          h.hour AS reservation_hour,
          s.max_capacity - IFNULL(SUM(r.number_of_people), 0) AS available_seats,
          CASE WHEN s.max_capacity - IFNULL(SUM(r.number_of_people), 0) <= 0 THEN 1 ELSE 0 END AS is_full
      FROM (
          SELECT 11 AS hour UNION ALL
          SELECT 12 UNION ALL
          SELECT 13 UNION ALL
          SELECT 14 UNION ALL
          SELECT 15 UNION ALL
          SELECT 16 UNION ALL
          SELECT 17 UNION ALL
          SELECT 18 UNION ALL
          SELECT 19 UNION ALL
          SELECT 20 UNION ALL
          SELECT 21
      ) h
      CROSS JOIN settings s
      LEFT JOIN reservations r
          ON r.reservation_date = ?
         AND r.reservation_hour = h.hour
         AND r.status IN ('pending', 'confirmed')
      GROUP BY h.hour, s.max_capacity
      ORDER BY h.hour
      `,
      [date]
    );

    // reservation_hour を string に変換して返す
    const formattedRows: TimeSlot[] = rows.map(r => ({
      reservation_hour: String(r.reservation_hour),
      available_seats: r.available_seats,
      is_full: r.is_full === 1,
    }));

    return res.status(200).json(formattedRows);
  } catch (err) {
    console.error('DB Error:', err);
    return res.status(500).json({ error: 'Database Error' });
  }
}