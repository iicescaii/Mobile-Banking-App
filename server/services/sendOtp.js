// /services/sendOtpService.js
const otpModel = require('../model/otpModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zenbank.ph@gmail.com',
    pass: 'alqb hjvr hesp ngna',
  },
});

const sendOtpToUser = async (user_id) => {
  try {
    const result = await otpModel.getEmailByUserId(user_id);
    if (!result.length) {
      throw new Error('Email not found');
    }

    const email = result[0].email;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await otpModel.deleteOldOtps(user_id);
    await otpModel.saveOtp(user_id, otp);

    const mailOptions = {
      from: 'zenbank.ph@gmail.com',
      to: email,
      subject: 'Your ZenBank OTP Code',
      text: `Hello, your ZenBank OTP code is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.response);
    return info.response;
  } catch (err) {
    console.error('Failed to send OTP:', err);
    throw err;
  }
};

module.exports = sendOtpToUser;