const axios = require('axios');

exports.handler = async function (event) {
    const baseUrl = process.env.DEV_BASE_URL;
    const realmId = process.env.DEV_REALM_ID;
    const minorVersion = '65';

    if (!baseUrl || !realmId) {
        return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Server misconfigured' }) };
    }

    const qs = event?.queryStringParameters || {};
    const {
        accessToken,
        user,
        receiptId,
        receiptType,
        projectId,
        project,
        dateIsoFormat,
        supplierName,
        supplierAddress,
        dateTime,
        totalAmount,
    } = qs;

    if (!accessToken) {
        return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Missing accessToken' }) };
    }

    // Coerce numeric fields and basic input checks
    const amountNum = Number(totalAmount);
    if (!Number.isFinite(amountNum) || amountNum < 0) {
        return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid totalAmount' }) };
    }
    if (!dateIsoFormat) {
        return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Missing dateIsoFormat (YYYY-MM-DD)' }) };
    }

    // Ensure single slash between base and path
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const url = `${base}/${realmId}/purchase?minorversion=${encodeURIComponent(minorVersion)}`;

    const expensePayload = {
        TxnDate: String(dateIsoFormat),
        PaymentType: 'Cash',
        AccountRef: { value: '35', name: 'Checking' },
        EntityRef: { value: '61', type: 'Vendor' },
        PrivateNote: `Receipt from ${supplierName}, ${supplierAddress} on ${dateTime}. Submitted by ${user}.`,
        Line: [
            {
                DetailType: 'AccountBasedExpenseLineDetail',
                Amount: amountNum,
                Description: receiptType,
                AccountBasedExpenseLineDetail: {
                    AccountRef: { value: receiptId, name: receiptType },
                    CustomerRef: { value: projectId, name: project },
                },
            },
        ],
    };

    try {
        const response = await axios.post(url, expensePayload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            timeout: 10000,
            validateStatus: (s) => s >= 200 && s < 500, // let 4xx through for custom handling
        });

        if (response.status !== 200) {
            return {
                statusCode: response.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: 'QuickBooks create purchase failed',
                    details: response.data,
                }),
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error('Error creating expense:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
        });
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Failed to create expense' }),
        };
    }
};
