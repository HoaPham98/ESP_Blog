import { Route } from '@angular/router';

import { HomeComponent } from './';
import { StoryComponent } from '../entities/story'

export const HOME_ROUTE: Route = {
    path: '',
    component: StoryComponent,
    data: {
        authorities: [],
        pageTitle: 'Welcome, Java Hipster!'
    }
};
