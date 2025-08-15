const { getBoundary, Parse } = require('parse-multipart');
const { Client, product } = require('mindee');

const mindeeClient = new Client({
    apiKey: process.env.MINDEE_API_KEY
});

exports.handler = async function (event) {
    try {
        console.log('Parse Receipt: Starting ')
        // 1) Decode the base64 body into a Buffer
        const bodyBuffer = Buffer.from(event.body, 'base64');
        console.log('Parse Receipt: Made body buffer ')

        // 2) Pull the boundary string out of the Content-Type header
        const contentType = event.headers['content-type']
            || event.headers['Content-Type'];
        console.log('Parse Receipt: Made contentType')
        const boundary = getBoundary(contentType);
        console.log('Parse Receipt: Made boundary')

        // 3) Parse out the parts 
        const parts = Parse(bodyBuffer, boundary);
        console.log('Parse Receipt: Got the parts - ', parts)
        // parts[0] looks like:
        // { filename: 'receipt.jpg', type: 'image/jpeg', data: <Buffer …> }
        const file = parts[0];
        console.log('Parse Receipt: file is - ', file)

        // 4) Turn that Buffer into a Mindee input
        const input = mindeeClient.docFromBuffer(file.data, file.filename);

        console.log('Mindee Status: About to make call')
        // 5) Send to Mindee
        const apiResponse = await mindeeClient.parse(
            product.ReceiptV5,
            input
        );

        console.log('Mindee Status: Responded successfully')
        console.log('\nMindee Response: ', apiResponse.document)
        // 6) Return the structured data
        return {
            statusCode: 200,
            body: JSON.stringify(apiResponse.document)
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
}
