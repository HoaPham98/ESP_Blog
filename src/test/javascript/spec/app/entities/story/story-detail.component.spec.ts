/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { BlogTestModule } from '../../../test.module';
import { StoryDetailComponent } from '../../../../../../main/webapp/app/entities/story/story-detail.component';
import { StoryService } from '../../../../../../main/webapp/app/entities/story/story.service';
import { Story } from '../../../../../../main/webapp/app/entities/story/story.model';

describe('Component Tests', () => {

    describe('Story Management Detail Component', () => {
        let comp: StoryDetailComponent;
        let fixture: ComponentFixture<StoryDetailComponent>;
        let service: StoryService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [BlogTestModule],
                declarations: [StoryDetailComponent],
                providers: [
                    StoryService
                ]
            })
            .overrideTemplate(StoryDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(StoryDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(StoryService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new Story(123)));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.story).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
