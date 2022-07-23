import { KeyValue } from "@angular/common";

export class Helper {
    static asIsOrder() {
        return 1;
    }

    static numberedKeyOrder(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
        const aStepId = parseInt(a.key, 10);
        const bStepId = parseInt(b.key, 10);
        return aStepId > bStepId ? 1 : (bStepId > aStepId ? -1 : 0);
    }
}