import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Profile } from "src/app/Profile";

@Component({
    selector: 'profile-delete-dialog',
    templateUrl: 'profile-delete-dialog.html'
})
export class ProfileDeleteDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: Profile) { }
 }