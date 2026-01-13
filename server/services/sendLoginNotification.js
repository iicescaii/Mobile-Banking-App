const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zenbank.ph@gmail.com',
    pass: 'alqb hjvr hesp ngna', // Use env variables for production!
  },
});

const sendLoginNotification = (email, callback) => {
  const mailOptions = {
    from: 'zenbank.ph@gmail.com',
    to: email,
    subject: 'Login Notification from Zenbank',
    text: `Hello,

You have successfully logged in to your Zenbank account. If this wasn't you, please contact support immediately.

Thank you,
Zenbank Team`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return callback(err);
    console.log('✅ Login notification email sent:', info.response);
    callback(null, info.response);
  });
};

module.exports = sendLoginNotification;
