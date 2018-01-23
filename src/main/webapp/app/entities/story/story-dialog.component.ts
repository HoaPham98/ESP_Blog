import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { DatePipe } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { Subscription } from 'rxjs/Subscription';

import { Story } from './story.model';
import { StoryPopupService } from './story-popup.service';
import { StoryService } from './story.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-story-dialog',
    templateUrl: './story-dialog.component.html'
})
export class StoryDialogComponent implements OnInit {

    story: Story;
    isSaving: boolean;

    users: User[];
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private datePipe: DatePipe,
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private storyService: StoryService,
        private userService: UserService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.subscription = this.route.params.subscribe((params) => {
            this.open(params['id']);
        });
    }

    open(id?: number | any) {
        if (id) {
            this.storyService.find(id).subscribe((story) => {
                this.story = story;
            });
        } else {
            this.story = new Story();
        }
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clear() {
        window.history.back()
    }

    save() {
        this.isSaving = true;
        this.story.user = this.users[1];
        this.story.date = this.datePipe
        .transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
        if (this.story.id !== undefined) {
            this.subscribeToSaveResponse(
                this.storyService.update(this.story));
        } else {
            this.subscribeToSaveResponse(
                this.storyService.create(this.story));
        }
    }

    private subscribeToSaveResponse(result: Observable<Story>) {
        result.subscribe((res: Story) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Story) {
        this.eventManager.broadcast({ name: 'storyListModification', content: 'OK'});
        this.isSaving = false;
        window.history.back();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-story-popup',
    template: ''
})
export class StoryPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private storyPopupService: StoryPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.storyPopupService
                    .open(StoryDialogComponent as Component, params['id']);
            } else {
                this.storyPopupService
                    .open(StoryDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
