import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Story} from './story.model';

@Component({
    selector: 'jhi-ckeditor',
    template: `
  <ckeditor
    [(ngModel)]="ckeditorContent"
    skin="moono-lisa"
    (change)="onChange($event)"
    [config]="ckEditorConfig">
  </ckeditor>
  `
})
export class CkeditorComponent implements OnInit {

    @Output() onSave = new EventEmitter<any>();
    @Input() story: Story;

    ckeditorContent: any;

    ckEditorConfig: {} = {
        'removeButtons': 'Save'
    };

    constructor() {

    }

    ngOnInit() {
        this.ckeditorContent = this.story.content;
    }

    save() {
        this.onSave.emit(this.ckeditorContent);
    }

    onChange() {
        this.save();
    }
}
