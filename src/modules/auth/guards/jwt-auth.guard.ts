import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Public } from "../decorators/public.decorator";

@Injectable()
export class JWTAuthGuard extends AuthGuard("jwt") {
    constructor (
        private reflector: Reflector
    ) {super();}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const publicKey = this.reflector.get(Public, context.getHandler());
        if (publicKey) return true;
        return super.canActivate(context);
    }
}