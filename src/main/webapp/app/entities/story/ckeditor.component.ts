import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Story} from './story.model';

@Component({
    selector: 'jhi-ckeditor',
    template: `
  <ckeditor
    [(ngModel)]="ckeditorContent"
    skin="moono-lisa"
    [config]="ckEditorConfig">
      <ckbutton [name]="'saveButton'"
                [command]="'saveCmd'"
                (click)="save($event)"
                [icon]="'http://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/24/save-icon.png'"
                [label]="'Save Document'"
                [toolbar]="'document,1'">
      </ckbutton>
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
}
