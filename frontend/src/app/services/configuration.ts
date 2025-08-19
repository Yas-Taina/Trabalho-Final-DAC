import { HttpHeaders, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { Param } from './param';

export interface ConfigurationParameters {

    apiKeys?: {[ key: string ]: string};
    username?: string;
    password?: string;
    accessToken?: string | (() => string);
    basePath?: string;
    withCredentials?: boolean;
    encoder?: HttpParameterCodec;
    encodeParam?: (param: Param) => string;
    credentials?: {[ key: string ]: string | (() => string | undefined)};
}

export class Configuration {
    apiKeys?: {[ key: string ]: string};
    username?: string;
    password?: string;
    accessToken?: string | (() => string);
    basePath?: string;
    withCredentials?: boolean;
    encoder?: HttpParameterCodec;
    encodeParam: (param: Param) => string;
    credentials: {[ key: string ]: string | (() => string | undefined)};

constructor({ accessToken, apiKeys, basePath, credentials, encodeParam, encoder, password, username, withCredentials }: ConfigurationParameters = {}) {
        if (apiKeys) {
            this.apiKeys = apiKeys;
        }
        if (username !== undefined) {
            this.username = username;
        }
        if (password !== undefined) {
            this.password = password;
        }
        if (accessToken !== undefined) {
            this.accessToken = accessToken;
        }
        if (basePath !== undefined) {
            this.basePath = basePath;
        }
        if (withCredentials !== undefined) {
            this.withCredentials = withCredentials;
        }
        if (encoder) {
            this.encoder = encoder;
        }
        this.encodeParam = encodeParam ?? (param => this.defaultEncodeParam(param));
        this.credentials = credentials ?? {};

        if (!this.credentials['bearerAuth']) {
            this.credentials['bearerAuth'] = () => {
                return typeof this.accessToken === 'function'
                    ? this.accessToken()
                    : this.accessToken;
            };
        }
    }

    public selectHeaderContentType (contentTypes: string[]): string | undefined {
        if (contentTypes.length === 0) {
            return undefined;
        }

        const type = contentTypes.find((x: string) => this.isJsonMime(x));
        if (type === undefined) {
            return contentTypes[0];
        }
        return type;
    }

    public selectHeaderAccept(accepts: string[]): string | undefined {
        if (accepts.length === 0) {
            return undefined;
        }

        const type = accepts.find((x: string) => this.isJsonMime(x));
        if (type === undefined) {
            return accepts[0];
        }
        return type;
    }

    public isJsonMime(mime: string): boolean {
        const jsonMime: RegExp = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime !== null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }

    public lookupCredential(key: string): string | undefined {
        const value = this.credentials[key];
        return typeof value === 'function'
            ? value()
            : value;
    }

    public addCredentialToHeaders(credentialKey: string, headerName: string, headers: HttpHeaders, prefix?: string): HttpHeaders {
        const value = this.lookupCredential(credentialKey);
        return value
            ? headers.set(headerName, (prefix ?? '') + value)
            : headers;
    }

    public addCredentialToQuery(credentialKey: string, paramName: string, query: HttpParams): HttpParams {
        const value = this.lookupCredential(credentialKey);
        return value
            ? query.set(paramName, value)
            : query;
    }

    private defaultEncodeParam(param: Param): string {
        const value = param.dataFormat === 'date-time' && param.value instanceof Date
            ? (param.value as Date).toISOString()
            : param.value;

        return encodeURIComponent(String(value));
    }
}
