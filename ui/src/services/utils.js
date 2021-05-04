export function checkResponse(response) {
    if (!response.ok) {
        const message = JSON.parse(response).message || 'Server communication failed';
        throw new Error(message);
    }
    return response;
}
