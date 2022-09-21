import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class StatsResolver {
  constructor() {}

  resolve(route: ActivatedRouteSnapshot) {
    if (route.params.membershipId !== undefined) {
        return Promise.resolve(route.params.membershipId);
    }

    return Promise.resolve("Stats");
  }
}