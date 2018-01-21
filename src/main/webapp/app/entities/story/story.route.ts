import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { StoryComponent } from './story.component';
import { StoryDetailComponent } from './story-detail.component';
import { StoryPopupComponent } from './story-dialog.component';
import { StoryDeletePopupComponent } from './story-delete-dialog.component';

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
    }
];

export const storyPopupRoute: Routes = [
    {
        path: 'story-new',
        component: StoryPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Stories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'story/:id/edit',
        component: StoryComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'Stories'
        },
        canActivate: [UserRouteAccessService],
        // outlet: 'popup'
    },
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
