const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "sayedarrafi142403@gmail.com" };

exports.sendEmail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "sayedarrafi142403@gmail.com",
            pass: "iiznaifkxvbfyych"
        }
    });
    return (
        transporter
            .sendMail(emailData)
            .then(info => console.log(`Message sent: ${info.response}`))
            .catch(err => console.log(`Problem sending email: ${err}`))
    );
};