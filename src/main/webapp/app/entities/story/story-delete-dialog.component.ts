import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Story } from './story.model';
import { StoryPopupService } from './story-popup.service';
import { StoryService } from './story.service';
import {CommentService} from '../comment';

@Component({
    selector: 'jhi-story-delete-dialog',
    templateUrl: './story-delete-dialog.component.html'
})
export class StoryDeleteDialogComponent {

    story: Story;

    constructor(
        private storyService: StoryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        public commentService: CommentService,
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.commentService.deleteByStory(id).subscribe((respone) => {
            this.storyService.delete(id).subscribe((response) => {
                this.eventManager.broadcast({
                    name: 'storyListModification',
                    content: 'Deleted an story'
                });
                this.activeModal.dismiss(true);
            });
        });
    }
}

@Component({
    selector: 'jhi-story-delete-popup',
    template: ''
})
export class StoryDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private storyPopupService: StoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.storyPopupService
                .open(StoryDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
