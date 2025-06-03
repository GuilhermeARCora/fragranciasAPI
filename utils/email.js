const nodemailer = require('nodemailer');

const sendEmail = options => {
    //Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // Activate in gmail "less secure app" option
    });

    //Define the email options


    //Actually send the email


};

module.exports = {
    sendEmail
};