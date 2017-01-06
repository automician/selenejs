import * as webdriver from "selenium-webdriver";
import TimeoutError = webdriver.error.TimeoutError;

export interface ICondition<T> {
    fn(): T;
    description(): string;
}


export class Condition<T> implements ICondition<T>{
    fn: () => T;
    private message: string;

    constructor(message: string, fn: () => T) {
        this.message = message;
        this.fn = fn;
    }

    description(): string {
        return this.message;
    }

    toString(): string {
        return this.description();
    }
}


export function wait<T>(condition: ICondition<T>, timeout: number): Promise<T> {
    const polling = 100;
    const maxAttempts = timeout / polling;
    const start = Date.now();

    const attempt = (reason) => {
        return condition.fn();
    };

    const exitCatchChainOnTimeout = (reason) => {
        return Date.now() - start > timeout ?
            Promise.resolve(new TimeoutError(
                `failed on timeout while waiting ${timeout}ms for ${condition} with reason: ${reason}`)) :
            Promise.reject(reason);
    };

    const delayOnFailedAttempt = (reason) => {
        return new Promise((resolve, reject) =>{
            setTimeout(() => reject(reason), polling);
        });
    };

    return [...(Array(maxAttempts).keys())]
        .reduce(
            (attempts, _) => attempts
                .catch(attempt)
                .catch(exitCatchChainOnTimeout)
                .catch(delayOnFailedAttempt),
            Promise.reject(new Error("init attempts catch chain")))
        .then(result =>
            result instanceof TimeoutError ?
                Promise.reject(result) :
                Promise.resolve(result));
}


export interface IEntityCondition<E, T> {
    fn(entity:E): T;
    description(): string;
}


export class EntityCondition<E, T> implements IEntityCondition<E, T>{
    fn: (entity: E) => T;
    private message: string;

    constructor(message: string, fn: () => T) {
        this.message = message;
        this.fn = fn;
    }

    description(): string {
        return this.message;
    }
}


export function waitFor<E, T>(entity: E, condition: IEntityCondition<E, T>, timeout: number): Promise<T> {
    const polling = 100;
    const maxAttempts = timeout / polling;
    const start = Date.now();

    const attempt = (reason) => {
        return condition.fn(entity);
    };

    const exitCatchChainOnTimeout = (reason) => {
        return Date.now() - start > timeout ?
            Promise.resolve(new TimeoutError(
                `failed on timeout while waiting ${timeout}ms for ${condition} with reason: ${reason}`)) :
            Promise.reject(reason);
    };

    const delayOnFailedAttempt = (reason) => {
        return new Promise((resolve, reject) =>{
            setTimeout(() => reject(reason), polling);
        });
    };

    return [...(Array(maxAttempts).keys())]
        .reduce(
            (attempts, _) => attempts
                .catch(attempt)
                .catch(exitCatchChainOnTimeout)
                .catch(delayOnFailedAttempt),
            Promise.reject(new Error("init attempts catch chain")))
        .then(result =>
            result instanceof TimeoutError ?
                Promise.reject(result) :
                Promise.resolve(result));
}