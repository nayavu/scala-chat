const API_BASE_URL = '/api/auth';

export class AuthService {
    login(username) {
        return fetch(API_BASE_URL + '/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body:  JSON.stringify({
                username
            })
        }).then((response) => {
            if (!response.ok) {
                return response.json()
                    .then((res) => { throw new Error(res.message || 'Server communication failed'); });
            }
            return response.json();
        });

        // Test data
        // return new Promise((resolve) => {
        //     resolve({ userId: '9', nickname: username, onlineSince: Date.now() });
        // });
    }

    logout(token) {
        return fetch(API_BASE_URL + '/logout', {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        }).then((response) => {
            if (!response.ok) {
                // ignore any error during logout
                return;
            }
            return response;
        });

        // Test data
        // return new Promise((resolve) => {
        //     resolve({});
        // });
    }
}
