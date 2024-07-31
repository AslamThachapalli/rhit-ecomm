interface ICacheEntry {
    value: any;
    expiry: number;
}

class Cache {
    private static _instance: Cache

    private inMemoryDb: Map<string, ICacheEntry>

    private constructor() {
        this.inMemoryDb = new Map<string, ICacheEntry>()
    }

    static get instance() {
        if (!this._instance) {
            this._instance = new Cache();
        }

        return this._instance;
    }

    set(
        type: string,
        args: string[],
        value: any,
        expirySeconds: number = 100,
    ): void {
        const key = this.generateKey(type, args);

        this.inMemoryDb.set(key, {
            value,
            expiry: new Date().getTime() + expirySeconds * 1000,
        });
    }

    get(type: string, args: string[]): any {
        const key = this.generateKey(type, args);
        const entry = this.inMemoryDb.get(key);

        if (!entry) {
            return null;
        }
        if (new Date().getTime() > entry.expiry) {
            this.inMemoryDb.delete(key);
            return null;
        }
        return entry.value;
    }

    evict(type: string, args: string[]): null {
        const key = this.generateKey(type, args);
        this.inMemoryDb.delete(key);
        return null;
    }

    private generateKey(type: string, args: string[]): string {
        return `${type}:${JSON.stringify(args)}`;
    }
}

const cache = Cache.instance;

export default cache;