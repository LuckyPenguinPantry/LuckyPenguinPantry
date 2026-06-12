exports.handler = async function(event) {
  try {
    const target = event.queryStringParameters && event.queryStringParameters.url;
    if (!target) {
      return json(400, { _apiError: 'Missing Spoonacular API URL.' });
    }

    const parsed = new URL(target);
    if (parsed.hostname !== 'api.spoonacular.com') {
      return json(400, { _apiError: 'Only Spoonacular API requests are allowed.' });
    }

    const response = await fetch(parsed.toString());
    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: text
    };
  } catch (error) {
    return json(500, { _apiError: `Serverless proxy error: ${error.message}` });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  };
}
