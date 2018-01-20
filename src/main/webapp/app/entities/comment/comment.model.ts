import { BaseEntity, User } from './../../shared';

export class Comment implements BaseEntity {
    constructor(
        public id?: number,
        public content?: string,
        public story?: BaseEntity,
        public user?: User,
    ) {
    }
}
