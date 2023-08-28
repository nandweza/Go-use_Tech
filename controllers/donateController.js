exports.getDonatePage = (req, res) => {
    res.render('donate/donate');
}

exports.postDonate = (req, res) => {
    const { amount, phoneNumber } = req.body;
  
    axios
        .post('https://api.mtnuganda.co.ug/collection/v1_0/requesttopay', {
            amount,
            currency: 'UGX',
            externalId: '123', // Generate a unique ID for each payment request
            payer: {
                partyIdType: 'MSISDN',
                partyId: phoneNumber,
            },
            payerMessage: 'Donation',
            payeeNote: 'Donation',
        })
        .then((response) => {
            // Handle the API response
            console.log(response.data);
            res.send('Payment request initiated successfully').status(202);
        })
        .catch((error) => {
            // Handle any errors
            console.error(error);
            // res.status(500).send('Error occurred while initiating payment');
            res.redirect('error/404');
        });
}
