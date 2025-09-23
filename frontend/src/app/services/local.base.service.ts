export class LocalBaseService<T> {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  getAll(): T[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getById(id: string, idKey: keyof T): T | undefined {
    return this.getAll().find(item => (item as any)[idKey] === id);
  }

  saveAll(data: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  add(item: T): void {
    const data = this.getAll();
    data.push(item);
    this.saveAll(data);
  }

  update(id: string, idKey: keyof T, item: T): void {
    const data = this.getAll();
    const index = data.findIndex(d => (d as any)[idKey] === id);
    if (index > -1) {
      data[index] = item;
      this.saveAll(data);
    }
  }

  delete(id: string, idKey: keyof T): void {
    const data = this.getAll().filter(d => (d as any)[idKey] !== id);
    this.saveAll(data);
  }
}
