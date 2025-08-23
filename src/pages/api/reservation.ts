import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../lib/db';

interface ReservationBody {
  name: string;
  date: string;   // YYYY-MM-DD
  tel: string;
  hour: string;   // "11" など（数値文字列）
  people: string; // "2" など（数値文字列）
  note: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, date, tel, hour, people, note }: ReservationBody = req.body || {};
  if (!name || !date || !hour || !people) {
    return res.status(400).json({ success: false, message: '必須項目が足りません' });
  }

  const hourNum = parseInt(hour, 10);
  const peopleNum = parseInt(people, 10);
  if (Number.isNaN(hourNum) || Number.isNaN(peopleNum) || peopleNum <= 0) {
    return res.status(400).json({ success: false, message: '入力値が不正です' });
  }

  try {
    const connection = await getConnection();

    // 1) キャパ取得
    const [settingsRows] = await connection.execute('SELECT max_capacity FROM settings LIMIT 1');
    if (!Array.isArray(settingsRows) || settingsRows.length === 0) {
      return res.status(500).json({ success: false, message: '設定が見つかりません' });
    }
    const maxCapacity = (settingsRows as any)[0].max_capacity as number;

    // 2) 既存予約合計
    const [reservedRows] = await connection.execute(
      `SELECT IFNULL(SUM(number_of_people), 0) AS reserved
         FROM reservations
        WHERE reservation_date = ?
          AND reservation_hour = ?
          AND status IN ('pending','confirmed')`,
      [date, hourNum]
    );
    const reserved = (reservedRows as any)[0].reserved as number;

    const available = maxCapacity - reserved;

    // 3) 残席チェック
    if (peopleNum > available) {
      return res
        .status(400)
        .json({ success: false, message: `残席が足りません。残席: ${available}席` });
    }

    // 4) 予約作成
    await connection.execute(
      `INSERT INTO reservations
        (name, phone, reservation_date, reservation_hour, number_of_people, note, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, tel, date, hourNum, peopleNum, note, 'pending']
    );

    return res.status(200).json({ success: true, message: '予約が保存されました' });
  } catch (err) {
    console.error('DB Error:', err);
    return res.status(500).json({ success: false, message: 'Database Error' });
  }
}