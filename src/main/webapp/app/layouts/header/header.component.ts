import {Component} from '@angular/core';

@Component({
    selector: 'jhi-header',
    templateUrl: './header.component'
})
export class HeaderComponent {
    image: string;

    constructor() {
        this.image = 'http://clean-blog-angular.hunor.me/img/home-bg.jpg';
    }
}
