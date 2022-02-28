import { MultiIndex, MultiIndexValue } from "./mi";
import { Name } from "./name";

export class Singleton<T extends MultiIndexValue> {
    key: u64;
    mi: MultiIndex<T>;
    newObj: () => T;
    constructor(code: Name, scope: Name, table: Name, newObj: () => T) {
        this.key = table.N;
        this.newObj = newObj;
        this.mi = new MultiIndex<T>(code, scope, table, newObj);
    }

    set(value: T, payer: Name): void {
        let it = this.mi.find(this.key);
        if (it.isOk()) {
            this.mi.update(it, value, payer);
        } else {
            this.mi.store(value, payer);
        }
    }

    get(): T {
        let it = this.mi.find(this.key);
        if (it.isOk()) {
            return this.mi.get(it);
        }
        return this.newObj();
    }

    remove(): void {
        let it = this.mi.find(this.key);
        if (it.isOk()) {
            this.mi.remove(it);
        }
    }
}

// func NewSingletonDB(code, scope, table chain.Name, unpacker ...Unpacker) *SingletonDB;
// func (t *SingletonDB) Set(data DBValue, payer chain.Name);
// func (t *SingletonDB) Get() interface{};
// func (t *SingletonDB) Remove();