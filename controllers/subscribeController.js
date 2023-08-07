const https = require('https');

exports.subscribeEmail = (req, res) => {
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/92f01d1b30";

    const options = {
        method: "POST",
        auth: process.env.MAILCHIMP_NAME + ":" + process.env.MAILCHIMP_API
    }

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.render("success");
        } else {
            res.render("failure");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

}

exports.subscribeFailure = (req, res) => {
    res.redirect('/');
}
``