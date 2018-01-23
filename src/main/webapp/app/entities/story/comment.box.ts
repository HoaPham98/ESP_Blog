import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Comment } from '../comment/comment.model';
import { CommentService } from '../comment/comment.service';
import { Story, StoryService } from './index';
import { User, UserService } from '../../shared/index';
import { ResponseWrapper } from '../../shared/index';
import {LoginService, Principal} from '../../shared';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'jhi-comment-box',
    templateUrl: './comment.box.html'
})
export class CommentBoxComponent implements OnInit {

    comment: Comment;
    isSaving: boolean;

    comments: Comment[];
    user: User;

    private subscription: Subscription;

    /* Pass data from parent view to child view */
    @Input() story: Story;

    constructor(
        private jhiAlertService: JhiAlertService,
        private commentService: CommentService,
        private principal: Principal,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.comment = new Comment();
        this.user = this.principal.getCurrentUser();
        this.subscription = this.route.params.subscribe((params) => {
            this.getAllComments();
        });
    }

    click() {
        this.comment.user = this.user;
        this.comment.story = this.story;
        this.save();
    }

    save() {
        this.isSaving = true;
        if (this.comment.id !== undefined) {
            this.subscribeToSaveResponse(
                this.commentService.update(this.comment));
        } else {
            this.subscribeToSaveResponse(
                this.commentService.create(this.comment));
        }
    }

    private subscribeToSaveResponse(result: Observable<Comment>) {
        result.subscribe((res: Comment) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Comment) {
        this.eventManager.broadcast({ name: 'commentListModification', content: 'OK'});
        this.isSaving = false;
        this.comments.push(this.comment);
        this.comment = new Comment();
    }

    private onSaveError() {
        this.isSaving = false;
        this.comment = new Comment();
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackStoryById(index: number, item: Story) {
        return item.id;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }

    getAllComments() {
        this.commentService.getByStory(this.story.id).subscribe((cmts) =>{
            this.comments = cmts;
            console.log(this.comments);
        })
    }
}
