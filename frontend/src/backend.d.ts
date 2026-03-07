import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CountdownTimer {
    id: bigint;
    startTime: Time;
    duration: Time;
    isCompleted: boolean;
    endTime: Time;
    isPaused: boolean;
    name: string;
}
export type Time = bigint;
export type CountdownTimerId = bigint;
export interface backendInterface {
    completeTimer(id: CountdownTimerId): Promise<void>;
    createCountdownTimer(name: string, durationSeconds: bigint): Promise<CountdownTimerId>;
    deleteTimer(id: CountdownTimerId): Promise<void>;
    getActiveTimers(): Promise<Array<CountdownTimer>>;
    getAllCountdownTimers(): Promise<Array<CountdownTimer>>;
    getCompletedTimers(): Promise<Array<CountdownTimer>>;
    getCountdownTimer(id: CountdownTimerId): Promise<CountdownTimer>;
    pauseTimer(id: CountdownTimerId): Promise<void>;
    renameCountdownTimer(newName: string, id: CountdownTimerId): Promise<void>;
    resumeTimer(id: CountdownTimerId): Promise<void>;
}
