import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../enum';
import { getTranslation } from './translate.pipe';

@Pipe({
    name: 'role'
})
export class RolePipe implements PipeTransform {

    transform(value: number, ...args: unknown[]): unknown {
        let status = value as Role;
        let result: string;
        switch (status) {
            case Role.ADMIN:
                result = getTranslation('admin');
                break;
            case Role.USER:
                result = getTranslation('user');
                break;
            default:
                result = '';
                break;
        }
        return result;
    }
}