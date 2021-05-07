const API_BASE_URL = 'http://localhost:9000/api';
// const API_BASE_URL = '/api';

export class MemberService {
    join(nickname) {
        console.log(`Joining chat as ${nickname}`);

        return fetch(API_BASE_URL + '/auth/join', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body:  JSON.stringify({
                nickname
            })
        }).then((response) => {
            if (!response.ok) {
                return response.json()
                    .then((res) => { throw new Error(res.message || 'Server communication failed'); });
            }
            return response.json();
        });
    }

    leave(token) {
        console.log('Leaving chat');

        return fetch(API_BASE_URL + '/auth/leave', {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        }).then((response) => {
            if (!response.ok) {
                // ignore any error TODO fix this
                return;
            }
            return response;
        });
    }

    loadMembers(token) {
        console.log('Loading chat members list');

        return fetch(API_BASE_URL + '/members',
            {
                headers: {
                    'Authorization': token
                }
            }
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json()
                        .then((res) => {
                            throw new Error(res.message || 'Server communication failed');
                        });
                }
                return response.json();
            })
    }
}
