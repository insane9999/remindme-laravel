export interface IReminderData {
    id?: number;
    title: string;
    description: string;
    remind_at: number;
    event_at: number;
}

export interface IUserData {
    id: number;
    email: string;
    name: string;
}

export interface ILoginData {
    user: IUserData;
    access_token: string;
    refresh_token: string;
}

export interface ICredential {
    email: string;
    password: string
}