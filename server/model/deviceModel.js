const db = require('../config');

const registerDevice = async (user_id, device_name, device_type, biometrics_enabled) => {
  const sqlCheck = `
    SELECT * FROM device_table WHERE user_id = ? AND device_name = ? AND device_type = ?
  `;
  try {
    const [results] = await db.query(sqlCheck, [user_id, device_name, device_type]);
    if (results.length > 0) {
      throw new Error('Device already registered');
    }
    const sqlInsert = `
      INSERT INTO device_table 
      (user_id, device_name, device_type, biometrics_enabled, is_active, last_login_at, registered_at)
      VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())
    `;
    const [insertResult] = await db.query(
      sqlInsert,
      [user_id, device_name, device_type, biometrics_enabled || false]
    );
    return insertResult;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  registerDevice,
};
