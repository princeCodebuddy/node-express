export interface ServerInterface{
    nodeEnvironment: 'development'| 'production';
    port: number;
    jwtSecret: string;
}
export interface MailInterface{
    username: string;
    apiKey: string;
    fromAddress: string;
}
export interface CipherInterface{
    key_phrase:string;
    iv_phrase: string;
}