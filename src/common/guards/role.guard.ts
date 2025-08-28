import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        //if not roles required
        if (!requiredRoles) {
            return true;
        }
        //getting the user
        const { user } = context.switchToHttp().getRequest();

        return requiredRoles.some((role) => {
            if (Array.isArray(user?.roles)) {
                return user.roles.include(role);
            }
            return user?.role === role;
        })
    }
}
