const nodemailer = require('nodemailer');

exports.getContactPage = (req, res) => {
    res.render('contact');
}

exports.sendMessage = (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'usetech.go@gmail.com',
            pass: 'Jona1234@!'
        }
    });
    
    const mailOptions = {
        from: req.body.email,
        to: 'usetech.go@gmail.com',
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('success');
        }
    })
}
