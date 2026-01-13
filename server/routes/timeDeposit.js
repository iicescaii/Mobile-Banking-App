// timeDeposit.js
const express = require("express");
const td = require("../model/td"); // Import the Time Deposit model
const router = express.Router();

// GET Route to fetch all Time Deposits
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  console.log("📩 Fetching for user_id:", user_id);

  try {
    const deposits = await td.getDepositsByAccount(user_id);
    res.status(200).json(deposits);
  } catch (error) {
    console.error("Error fetching time deposits:", error);
    res.status(500).json({ error: "Failed to fetch time deposits" });
  }
});

// POST Route to create a new Time Deposit
router.post("/create", async (req, res) => {
  const { user_id, investmentAmount, investmentDuration, interest, nickname } =
    req.body;

  // Validate the input
  if (
    !user_id ||
    !investmentAmount ||
    !investmentDuration ||
    !interest ||
    !nickname
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const depositId = await td.createDeposit(
      user_id,
      investmentAmount,
      investmentDuration,
      interest,
      nickname
    );
    res.status(201).json({
      message: "Time Deposit created",
      depositId: depositId,
    });
  } catch (error) {
    console.error("Error creating time deposit:", error);
    res.status(500).json({ error: "Failed to create time deposit" });
  }
});

module.exports = router;
