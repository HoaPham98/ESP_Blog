import { BaseEntity, User } from './../../shared';

export class Story implements BaseEntity {
    constructor(
        public id?: number,
        public title?: string,
        public content?: any,
        public date?: any,
        public imageUrl?: string,
        public comments?: BaseEntity[],
        public user?: User,
    ) {
    }
}
