import { HttpHeaders, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { CustomHttpParameterCodec } from './encoder';
import { Configuration } from './configuration';

export class BaseService {
    protected basePath = 'https://virtserver.swaggerhub.com/RAZERANTHOM/bantads/1.0.0';
    public defaultHeaders = new HttpHeaders();
    public configuration: Configuration;
    public encoder: HttpParameterCodec;

    constructor(basePath?: string|string[], configuration?: Configuration) {
        this.configuration = configuration || new Configuration();
        if (typeof this.configuration.basePath !== 'string') {
            const firstBasePath = Array.isArray(basePath) ? basePath[0] : undefined;
            if (firstBasePath != undefined) {
                basePath = firstBasePath;
            }

            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }

    protected canConsumeForm(consumes: string[]): boolean {
        return consumes.indexOf('multipart/form-data') !== -1;
    }

    protected addToHttpParams(httpParams: HttpParams, value: any, key?: string, isDeep: boolean = false): HttpParams {
        if (typeof value === 'object' && !(value instanceof Date)) {
            return this.addToHttpParamsRecursive(httpParams, value, isDeep ? key : undefined, isDeep);
        }
        return this.addToHttpParamsRecursive(httpParams, value, key);
    }

    protected addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string, isDeep: boolean = false): HttpParams {
        if (value === null || value === undefined) {
            return httpParams;
        }
        if (typeof value === 'object') {
            if (key != null) {
                return isDeep
                    ? Object.keys(value as Record<string, any>).reduce(
                        (hp, k) => hp.append(`${key}[${k}]`, value[k]),
                        httpParams,
                    )
                    : httpParams.append(key, JSON.stringify(value));
            }
            if (Array.isArray(value)) {
                value.forEach(elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key, value.toISOString());
                } else {
                    throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach(k => {
                    const paramKey = key ? `${key}.${k}` : k;
                    httpParams = this.addToHttpParamsRecursive(httpParams, value[k], paramKey);
                });
            }
            return httpParams;
        } else if (key != null) {
            return httpParams.append(key, value);
        }
        throw Error("key may not be null if value is not object or array");
    }
}
