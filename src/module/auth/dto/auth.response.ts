import { UserEntity } from "../entities";

export class AuthResponse {
    user: UserEntity;
    accessToken: string;
    refreshToken: string;
}
