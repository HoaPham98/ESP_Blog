import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiParseLinks, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { Story } from './story.model';
import { StoryService } from './story.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-story',
    templateUrl: './story.component.html'
})
export class StoryComponent implements OnInit, OnDestroy {

    stories: Story[];
    currentAccount: any;
    eventSubscriber: Subscription;
    itemsPerPage: number;
    links: any;
    page: any;
    predicate: any;
    queryCount: any;
    reverse: any;
    totalItems: number;
    currentDate: any;
    popularStories: Story[];
    limitSize = 5;

    constructor(
        private storyService: StoryService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private parseLinks: JhiParseLinks,
        private principal: Principal
    ) {
        this.stories = [];
        this.popularStories = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
        this.predicate = 'id';
        this.reverse = true;
        this.currentDate = new Date();
    }

    loadAll() {
        this.storyService.query({
            page: this.page,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    reset() {
        this.page = 0;
        this.stories = [];
        this.popularStories = [];
        this.loadAll();
    }

    loadPage(page) {
        this.page = page;
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInStories();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Story) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInStories() {
        this.eventSubscriber = this.eventManager.subscribe('storyListModification', (response) => this.reset());
    }

    sort() {
        const result = ['date,desc'];
        return result;
    }

    limitHtml(content: any, limit: number): string {
        const changedString = String(content).replace(/<[^>]+>/gm, '');
        const length = changedString.length;

        return changedString.length > limit ? changedString.substr(0, limit - 1) + '...' : changedString;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        for (let i = 0; i < data.length; i++) {
            this.stories.push(data[i]);
            if (i < this.limitSize) {
                this.popularStories.push(data[i])
            }
        }
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
