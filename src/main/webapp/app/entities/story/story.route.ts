import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { StoryComponent } from './story.component';
import { StoryDetailComponent } from './story-detail.component';
import { StoryDeletePopupComponent } from './story-delete-dialog.component';
import { StoryDialogComponent } from '../story';

export const storyRoute: Routes = [
    {
        path: 'story',
        component: StoryComponent,
        data: {
            authorities: [],
            pageTitle: 'Stories'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'story/:id',
        component: StoryDetailComponent,
        data: {
            authorities: [],
            pageTitle: 'Stories'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'story-new',
        component: StoryDialogComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Stories'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'story/:id/edit',
        component: StoryDialogComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Stories'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const storyPopupRoute: Routes = [
    {
        path: 'story/:id/delete',
        component: StoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Stories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
