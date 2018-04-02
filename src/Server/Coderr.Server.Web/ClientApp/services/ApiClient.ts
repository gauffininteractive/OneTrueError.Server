import { HttpClient, IHttpResponse, HttpError } from "./HttpClient";

export interface ICommandResponse {
    statusCode: number;
}

export interface IQueryResponse<T> {
    data: T;
}


export class ApiClient {
    private http: HttpClient = new HttpClient();

    constructor(private apiRootUrl: string) {
        console.log('using URL ', apiRootUrl);
        if (!this.apiRootUrl) {
            throw new Error("URL must be specified");
        }
        if (this.apiRootUrl.substr(this.apiRootUrl.length - 1, 1) !== "/")
            this.apiRootUrl += "/";
    }
    async command(cmd: any): Promise<any> {
        console.log('using URL ', this.apiRootUrl);
        var headers = {
            "X-Cqs-Name": cmd.constructor.TYPE_NAME
        };
        await this.http.post(`${this.apiRootUrl}cqs/`, cmd, "application/json", { type: cmd.constructor.TYPE_NAME }, headers);
    }

    query<T>(query: any): Promise<T> {
        console.log('using URL ', this.apiRootUrl);
        var headers = {
            "Accept": "application/json",
            "X-Cqs-Name": query.constructor.TYPE_NAME
        };
        return new Promise<T>((resolve, reject) => {
            this.http.post(`${this.apiRootUrl}cqs/`, query, "application/json", { type: query.constructor.TYPE_NAME }, headers)
                .then((result: IHttpResponse) => resolve(result.body))
                .catch((rejection: HttpError) => {
                    console.log(rejection);
                    if (rejection.reponse.statusCode === 401) {
                        //TODO: redirect;
                        return;
                    }
                    reject(rejection);
                });
        });
    }

    async auth(): Promise<any> {
        console.log('callint gauth')
        var result = await this.http.post(`${this.apiRootUrl}authenticate/`, null, "application/json");
        return result.body;
    }

}

