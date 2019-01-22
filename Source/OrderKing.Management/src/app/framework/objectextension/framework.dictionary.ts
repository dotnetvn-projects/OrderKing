import { IDictionary } from '../interface/framework.dictionary.interface';

export class Dictionary<K extends string, V> implements IDictionary<K, V> {

  private internalDict: { [key in K]?: V };

  constructor() {
    this.internalDict = {};
  }

  public getKeys() {
    const keys: K[] = [];
    // tslint:disable-next-line:forin
    for (const key in this.internalDict) {
      keys.push(key);
    }

    return keys;
  }

  // Type predicate to ensure v exists
  private exists(v: V | undefined): v is V {
    return v != null && typeof v !== 'undefined';
  }

  public getValues() {
    const vals: V[] = [];

    // tslint:disable-next-line:forin
    for (const key in this.internalDict) {
      const v = this.internalDict[key];
      if (this.exists(v)) {
        vals.push(v);
      }
    }

    return vals;
  }

  public get(key: K) {
    const v = this.internalDict[key];
    return this.exists(v)
      ? v
      : null;
  }

  public put(key: K, val: V): void {
    this.internalDict[key] = val;
  }

}
