const express = require('express');
const router = express.Router();
const db = require('../config'); // mysql2/promise connection

router.get('/user-transactions/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Get user's accounts
    const [accounts] = await db.query(
      `SELECT account_id, account_label, account_number FROM bank_account WHERE user_id = ?`,
      [userId]
    );

    if (accounts.length === 0) {
      return res.json({ transactions: [], accounts: [] });
    }

    const accountIds = accounts.map(acc => acc.account_id);
    const accountNumbers = accounts.map(acc => acc.account_number);

    // If the user has no accounts, return early to avoid SQL errors
    if (!accountIds.length) {
      return res.json({ transactions: [], accounts });
    }

    // send_to_own transactions (join on account_id)
    const [sendToOwn] = await db.query(
      `SELECT 
          sto.id AS id,
          sto.from_account_id AS from_account,
          f.account_label AS from_label,
          f.account_number AS from_number,

          sto.to_account_id AS to_account,
          t.account_label AS to_label,
          t.account_number AS to_number,

          sto.amount,
          sto.notes,
          sto.reference_code,
          sto.created_at AS timestamp,
          'send_to_own' AS type
        FROM send_to_own sto
        LEFT JOIN bank_account f ON sto.from_account_id = f.account_id
        LEFT JOIN bank_account t ON sto.to_account_id = t.account_id
        WHERE sto.from_account_id IN (?) OR sto.to_account_id IN (?)`,
      [accountIds, accountIds]
    );

    // send_to_any transactions (join on account_id)
    const [sendToAny] = await db.query(
      `SELECT 
          sta.transfer_id AS id,
          sta.from_account_id AS from_account,
          f.account_label AS from_label,
          f.account_number AS from_number,

          sta.to_account_id AS to_account,
          t.account_label AS to_label,
          t.account_number AS to_number,

          sta.amount,
          sta.note AS notes,
          sta.reference_code,
          sta.created_at AS timestamp,
          'send_to_any' AS type
        FROM send_to_any sta
        LEFT JOIN bank_account f ON sta.from_account_id = f.account_id
        LEFT JOIN bank_account t ON sta.to_account_id = t.account_id
        WHERE sta.from_account_id IN (?) OR sta.to_account_id IN (?)`,
      [accountIds, accountIds]
    );

    // payments (pay bills)
    const [payments] = await db.query(
      `SELECT 
          p.payment_id AS id,
          p.pay_from_account_id AS from_account,
          f.account_label AS from_label,
          f.account_number AS from_number,
          p.subscriber_account_number,        -- important!
          p.biller_id AS to_account,
          b.biller_name AS to_label,
          NULL AS to_number,
          p.amount,
          p.notes,
          NULL AS reference_code,
          p.created_at AS timestamp,
          'pay_bill' AS type
        FROM payments p
        LEFT JOIN bank_account f ON p.pay_from_account_id = f.account_id
        LEFT JOIN billers b ON p.biller_id = b.billers_id
        WHERE p.user_id = ?`,
      [userId]
    );

    // deposits (external bank deposits)
    const [deposits] = await db.query(
      `SELECT 
          d.deposit_id AS id,
          NULL AS from_account,
          NULL AS from_label,
          NULL AS from_number,

          d.linked_account_id AS to_account,
          la.bank_name AS to_label,
          la.account_number AS to_number,

          d.amount,
          NULL AS notes,
          NULL AS reference_code,
          d.timestamp AS timestamp,
          'deposit_external' AS type
        FROM deposits d
        LEFT JOIN linked_accounts la ON d.linked_account_id = la.linked_account_id
        WHERE la.user_id = ?`,
      [userId]
    );

    // Combine and sort all transactions by timestamp descending
    const allTransactions = [
      ...sendToOwn,
      ...sendToAny,
      ...payments,
      ...deposits
    ];
    allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ transactions: allTransactions, accounts });

  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;