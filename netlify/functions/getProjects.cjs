const axios = require('axios');

exports.handler = async function (event) {
    const baseUrl = process.env.DEV_BASE_URL;
    const realmId = process.env.DEV_REALM_ID;

    if (!baseUrl || !realmId) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) };
    }

    const qs = event.queryStringParameters || {};
    const accessToken = qs.accessToken;
    if (!accessToken) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing accessToken' }) };
    }

    // Ensure single slash between parts
    const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const path = `${base}${realmId}/query`;

    const query = `SELECT * FROM Customer WHERE Job = true AND Active = true`;
    const url = `${path}?query=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
            timeout: 10000,
            validateStatus: (s) => s >= 200 && s < 500,
        });

        if (response.status !== 200) {
            const errBody = response.data && typeof response.data === 'object' ? response.data : { message: String(response.data) };
            console.error('QBO query failed:', { status: response.status, data: errBody });
            return { statusCode: response.status, body: JSON.stringify({ error: 'QuickBooks query failed', details: errBody }) };
        }

        const customers = (response.data?.QueryResponse?.Customer) || [];
        const activeProjects = customers
            .filter((p) => p.IsProject === true)
            .map((p) => ({ id: p.Id, name: p.DisplayName }));

        return {
            statusCode: 200,
            body: JSON.stringify({ activeProjects }),
            headers: { 'Content-Type': 'application/json' },
        };
    } catch (error) {
        console.error('Error fetching projects:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
        });
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch project names' }) };
    }
};
