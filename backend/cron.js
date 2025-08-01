const cron = require('node-cron');
const pool = require('./config/db');

cron.schedule('* * * * *', async () => {
  try {
    const result = await pool.query(`
      UPDATE "order"
      SET status = 'delivered'
      WHERE status = 'pending'
        AND created_at <= NOW() - INTERVAL '30 minutes'
      RETURNING *
    `);

    if (result.rowCount > 0) {
      console.log(`✅ ${result.rowCount} order delivered.`);
    }
  } catch (err) {
    console.error('❌ Cron job error:', err.message);
  }
});

console.log('🔁 Cron job is active');
