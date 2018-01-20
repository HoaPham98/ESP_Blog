import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { Story } from './story.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class StoryService {

    private resourceUrl =  SERVER_API_URL + 'api/stories';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(story: Story): Observable<Story> {
        const copy = this.convert(story);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(story: Story): Observable<Story> {
        const copy = this.convert(story);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Story> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Story.
     */
    private convertItemFromServer(json: any): Story {
        const entity: Story = Object.assign(new Story(), json);
        entity.date = this.dateUtils
            .convertDateTimeFromServer(json.date);
        return entity;
    }

    /**
     * Convert a Story to a JSON which can be sent to the server.
     */
    private convert(story: Story): Story {
        const copy: Story = Object.assign({}, story);

        copy.date = this.dateUtils.toDate(story.date);
        return copy;
    }
}
