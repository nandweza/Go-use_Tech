const axios = require('axios');

class DonationModel {
    async processDonation(amount, phoneNumber) {
        try {
            const response = await axios.post('MTN_API_ENDPOINT', {
                amount: amount,
                phoneNumber: phoneNumber
                // Include other required parameters as per MTN API documentation
            }, {
                headers: {
                    Authorization: 'Bearer YOUR_ACCESS_TOKEN'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error processing donation:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
}

module.exports = new DonationModel();
