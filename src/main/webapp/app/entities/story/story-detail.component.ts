import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Story } from './story.model';
import { StoryService } from './story.service';
import { CommentService } from '../comment/comment.service'
import {Comment, CommentBoxComponent} from '../comment';

@Component({
    selector: 'jhi-story-detail',
    templateUrl: './story-detail.component.html'
})
export class StoryDetailComponent implements OnInit, OnDestroy {

    story: Story;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    @ViewChild(CommentBoxComponent) commentBox: CommentBoxComponent;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private storyService: StoryService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInStories();
    }

    load(id) {
        this.storyService.find(id).subscribe((story) => {
            this.story = story;
        });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInStories() {
        this.eventSubscriber = this.eventManager.subscribe(
            'storyListModification',
            (response) => this.load(this.story.id)
        );
    }
}
