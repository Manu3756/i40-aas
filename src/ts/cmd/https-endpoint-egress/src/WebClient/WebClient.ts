import tls from 'tls';
import Axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import https from 'https'

const logger = require('aas-logger/lib/log');

class WebClient {
  constructor() {}

  async postRequest<T>(
    baseUrl: string,
    body: string,
    user?: string,
    password?: string,
    tlsCert?: string
  ): Promise<AxiosResponse<T>> {
    let url: string = baseUrl;

    logger.debug( "[AAS Client] Posting to AAS ingress at " + url + " as user " + user + " with message: "+ JSON.stringify(body));

    var response;
    if (user && password) {
      response = await Axios.post<T>(url, body, {
        auth: {
          username: user as string,
          password: password as string,
        },
        httpsAgent: new https.Agent({
          ca: tlsCert as string,
          rejectUnauthorized: false
        }),
      });
    } else {
      response = await Axios.post<T>(url, body, {
        httpsAgent: new https.Agent({
          ca: tlsCert as string,
          rejectUnauthorized: false
        }),
      });
    }
    return response as AxiosResponse<T>;
  }
}

export { WebClient };
