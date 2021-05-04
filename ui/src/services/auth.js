import { checkResponse } from "@/services/utils";

// TODO
const API_URL = 'http://localhost:8080/api';

export class AuthService {
    login(username) {
        return fetch(API_URL + '/auth/login', {
            method: 'POST',
            body:  JSON.stringify({
                username
            })
        }).then((response) => {
            return checkResponse(response);
        });

        // Test data
        // return new Promise((resolve) => {
        //     resolve({ userId: '9', nickname: username, onlineSince: Date.now() });
        // });
    }

    logout() {
        return fetch(API_URL + '/auth/logout', {
            method: 'POST'
        }).then((response) => {
            return checkResponse(response);
        });

        // Test data
        // return new Promise((resolve) => {
        //     resolve({});
        // });
    }
}
