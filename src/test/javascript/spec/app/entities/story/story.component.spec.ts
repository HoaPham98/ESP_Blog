/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { Headers } from '@angular/http';

import { BlogTestModule } from '../../../test.module';
import { StoryComponent } from '../../../../../../main/webapp/app/entities/story/story.component';
import { StoryService } from '../../../../../../main/webapp/app/entities/story/story.service';
import { Story } from '../../../../../../main/webapp/app/entities/story/story.model';

describe('Component Tests', () => {

    describe('Story Management Component', () => {
        let comp: StoryComponent;
        let fixture: ComponentFixture<StoryComponent>;
        let service: StoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [BlogTestModule],
                declarations: [StoryComponent],
                providers: [
                    StoryService
                ]
            })
            .overrideTemplate(StoryComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StoryComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new Headers();
                headers.append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of({
                    json: [new Story(123)],
                    headers
                }));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.stories[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
