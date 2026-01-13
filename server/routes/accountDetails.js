const express = require("express");
const Account = require("../model/accounts");
const pool = require("../config");
const router = express.Router();

const verifyCredentials = async (accountNumber, email, mobile, dob) => {
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

    const mobileExists = await Account.checkMobileExist(mobile);  // fix function name
    if (!mobileExists) {
      return {
        success: false,
        message: "Mobile number not found. Check if your mobile is correct.",
      };
    }

    const dobExists = await Account.checkDobExist(dob);  // fix variable name
    if (!dobExists) {
      return {
        success: false,
        message: "Date of birth not found. Check if your DOB is correct.",
      };
    }

    return {
      success: true,
      message: "Account verified successfully.",
    };
  } catch (error) {
    console.error("Error verifying account and email:", error);
    return { success: false, message: "Error verifying account details." };
  }
};

router.post("/details", async (req, res) => {
  const { accountNumber, email, mobile, dob, agree, user_id } = req.body;

  if (!accountNumber || !email || !mobile || !dob || agree === undefined || !user_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const verification = await verifyCredentials(accountNumber, email, mobile, dob);

    if (!verification.success) {
      return res
        .status(400)
        .json({ success: false, message: verification.message });
    }

    // Update only terms_accepted in user_profile by user_id
    pool.query(
      "UPDATE user_profile SET terms_accepted = ? WHERE user_id = ?",
      [agree, user_id],
      (err, results) => {
        if (err) {
          console.error("Error updating terms_accepted:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "No user profile found with the provided user_id",
          });
        }

        res.json({
          success: true,
          message: "Terms accepted updated successfully",
        });
      }
    );
  } catch (error) {
    console.error("Error processing account update:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


module.exports = router;
