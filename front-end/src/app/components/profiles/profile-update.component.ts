import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Profile } from "src/app/Profile";

@Component({
    selector: 'profile-update-dialog',
    templateUrl: 'profile-update-dialog.html'
})
export class ProfileUpdateDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
 }