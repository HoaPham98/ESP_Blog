import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BlogSharedModule } from '../../shared';
import { BlogAdminModule } from '../../admin/admin.module';

import {
    StoryService,
    StoryPopupService,
    StoryComponent,
    StoryDetailComponent,
    StoryDialogComponent,
    StoryPopupComponent,
    StoryDeletePopupComponent,
    StoryDeleteDialogComponent,
    storyRoute,
    storyPopupRoute,
    CommentBoxComponent,
    CkeditorComponent,
} from './';

import { CKEditorModule } from 'ng2-ckeditor';

const ENTITY_STATES = [
    ...storyRoute,
    ...storyPopupRoute,
];

@NgModule({
    imports: [
        BlogSharedModule,
        BlogAdminModule,
        RouterModule.forChild(ENTITY_STATES),
        CKEditorModule,
    ],
    declarations: [
        StoryComponent,
        StoryDetailComponent,
        StoryDialogComponent,
        StoryDeleteDialogComponent,
        StoryPopupComponent,
        StoryDeletePopupComponent,
        CommentBoxComponent,
        CkeditorComponent,
    ],
    entryComponents: [
        StoryComponent,
        StoryDialogComponent,
        StoryPopupComponent,
        StoryDeleteDialogComponent,
        StoryDeletePopupComponent,
        CommentBoxComponent,
    ],
    providers: [
        StoryService,
        StoryPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BlogStoryModule {}
