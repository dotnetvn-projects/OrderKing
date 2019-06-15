export interface IDictionary<K, V> {
  getKeys(): K[];
  getValues(): V[];
  get(key: K): V | null; // the key might not exist
  put(key: K, val: V): void; // or boolean?
}
