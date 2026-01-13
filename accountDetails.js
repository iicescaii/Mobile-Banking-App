const express = require("express");
const Account = require("../model/accounts");
const pool = require("../config");
const router = express.Router();

const verifyAccountAndEmail = async (accountNumber, email) => {
  try {
    const accountExists = await Account.checkAccExists(accountNumber);
    if (!accountExists) {
      return { success: false, message: "Account number not found." };
    }

    const emailExists = await Account.checkEmailExist(email);
    if (!emailExists) {
      return {
        success: false,
        message: "Email not found. Check if your email is correct.",
      };
    }

    return {
      success: true,
      message: "Account and email verified successfully.",
    };
  } catch (error) {
    console.error("Error verifying account and email:", error);
    return { success: false, message: "Error verifying account details." };
  }
};

router.post("/details", async (req, res) => {
  const { accountNumber, email, mobile, dob, agree } = req.body;

  if (!accountNumber || !email || !mobile || !dob || agree === undefined) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const verification = await verifyAccountAndEmail(accountNumber, email);

    if (!verification.success) {
      return res
        .status(400)
        .json({ success: false, message: verification.message });
    }

    // If verification passed, update existing row in user_profile by email
    pool.query(
      "UPDATE user_profile SET mobile_number = ?, date_of_birth = ?, terms_accepted = ? WHERE email = ?",
      [mobile, dob, agree, email],
      (err, results) => {
        if (err) {
          console.error("Error updating user profile:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "No user profile found with the provided email",
          });
        }

        res.json({
          success: true,
          message: "Account updated successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error processing account update:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
  
module.exports = router;
