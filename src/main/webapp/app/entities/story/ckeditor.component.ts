import {Component, EventEmitter, Output} from '@angular/core';

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
export class CkeditorComponent {

    @Output() onSave = new EventEmitter<any>();
    ckeditorContent: any;

    ckEditorConfig: {} = {
    'removeButtons': 'Save'
    };

    constructor() {
        this.ckeditorContent = `<p>My HTML</p>`;
    }

    save() {
        this.onSave.emit(this.ckeditorContent);
    }
}
