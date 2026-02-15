import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type ReminderName = string;
export type ReminderId = bigint;
export interface Reminder {
    isCancelled: boolean;
    isCompleted: boolean;
    scheduledTime: Time;
    name: ReminderName;
    creationTime: Time;
}
export interface backendInterface {
    cancelReminder(reminderId: ReminderId): Promise<boolean>;
    completeReminder(reminderId: ReminderId): Promise<boolean>;
    createReminder(name: ReminderName, scheduledTime: Time): Promise<ReminderId>;
    getActiveReminders(): Promise<Array<Reminder>>;
    getCompletedReminders(): Promise<Array<Reminder>>;
    getReminder(reminderId: ReminderId): Promise<Reminder | null>;
    getTotalReminders(): Promise<bigint>;
}
