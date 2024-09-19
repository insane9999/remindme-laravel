import axios from 'axios';
import { GET_SESSION, USER_SESSION_KEY } from '../auth/AuthProvider';

const createHttpClient = () => {
    return axios.create({
        baseURL: 'http://localhost:8000/api/',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

const HTTPClient = createHttpClient();

// Add request interceptor to attach access token to headers
HTTPClient.interceptors.request.use(
    (config) => {
        const session = GET_SESSION();
        if (session) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration and refresh token logic
HTTPClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired access token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent endless loop
            try {
                const session = GET_SESSION();
                if (!session) {
                    return Promise.reject(error);
                }

                const { data: { data } } = await createHttpClient().put('session', undefined, {
                    headers: {
                        'Authorization': `Bearer ${session.refresh_token}`
                    }
                });

                const newAccessToken = data.access_token;
                const newRefreshToken = data.refresh_token;

                session.access_token = newAccessToken;
                session.refresh_token = newRefreshToken;

                localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));

                // Update Authorization header with new access token
                HTTPClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                // Retry the original request with new access token
                return HTTPClient(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, log the user out
                console.log('Refresh token expired, logging out...');
                localStorage.removeItem(USER_SESSION_KEY);
                // window.location.href = '/login'; // Redirect to login page
            }
        }

        return Promise.reject(error);
    }
);

interface APIResponse {
    ok: boolean,
    data: object | Array<any>;
    err: string;
    msg: string;
}

class APIService {

    static setToken(token: string) {
        HTTPClient.defaults.headers.common = { 'Authorization': `Bearer ${token}` };
    }

    private static handleError(error: any) {
        console.log(error);
    }

    private static handleResponse(res: APIResponse, resolve: (v: any) => void, reject: (v: any) => void) {
        if (res.ok) {
            resolve(res.data);
        } else {
            const error = {
                error: res.err,
                message: res.msg
            };
            this.handleError(error);
            reject(error);
        }
        resolve(res);
    }


    /**
     * HTTP GET Request
     * @param url
     * @param params
     */
    static get(url: string, params: Array<{ key: string, value: string }> = []): Promise<any> {
        // set request params
        const reqParams = new FormData();
        params.forEach(param => {
            reqParams.append(param.key, param.value);
        });

        const options = { params: reqParams };

        return new Promise(async (resolve, reject) => {
            try {
                const res = await HTTPClient.get(url, options);
                this.handleResponse(res.data, resolve, reject);
            } catch (err) {
                console.log(err);
                this.handleError(err);
                reject(err);
            }
        })
    }

    /**
     * HTTP POST Request
     * @param url
     * @param data
     */
    static post(url: string, data: any = undefined): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await HTTPClient.post(url, data);
                this.handleResponse(res.data, resolve, reject);
            } catch (err) {
                this.handleError(err);
                reject(err);
            }
        })
    }

    /**
     * HTTP PUT Request
     * @param url
     * @param data
     */
    static put(url: string, data: any = undefined): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await HTTPClient.put(url, data);
                this.handleResponse(res.data, resolve, reject);
            } catch (err) {
                this.handleError(err);
                reject(err);
            }
        })
    }

    /**
     * HTTP DELETE Request
     * @param url
     */
    static delete(url: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await HTTPClient.delete(url);
                this.handleResponse(res.data, resolve, reject);
            } catch (err) {
                this.handleError(err);
                reject(err);
            }
        })
    }
}

export default APIService;