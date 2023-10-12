export class UserProfile {
    _id: number;
    userid: string;
    nickname?: string;
    picture?: string
    profile?: {
        fullname?:string,
        intro?:string,
        interest?: []
    };
    authProfile?: any
}