export type Nullable<T> = T | null;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type ValueOf<T> = T[keyof T];

export type WithUuid<T> = T & { uuid: string };

export type WithCreationDate<T> = T & { createdAt: Date };

export type WithId<T> = T & { id: number };
