import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BaseService {
  protected apiUrl = "http://localhost:8080";
  protected headers = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(protected http: HttpClient) {}
}
