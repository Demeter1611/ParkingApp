const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.imitate.email',
    port: 587,
    secure: false,
    auth: {
        user: 'gtapwb0AkESkHQGcf-UiUw',
        pass: 'KcEUjq1RCYadDEfzRVO3'
    }
});


async function sendInvitationEmail(toEmail, inviteLink) {
    const mailOptions = {
        from: '"Parking Admin" <noreply@parkingapp.com>',
        to: toEmail,
        subject: 'Join our Parking Lot',
        html: `<b>Click here:</b> <a href="${inviteLink}">Accept Invite</a>`
    };

    return await transporter.sendMail(mailOptions);
}

module.exports = {
    sendInvitationEmail
}