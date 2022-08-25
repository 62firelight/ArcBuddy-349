import { Component, OnInit } from '@angular/core';
import { DestinyService } from 'src/app/services/destiny.service';

@Component({
  selector: 'app-vendors-page',
  templateUrl: './vendors-page.component.html',
  styleUrls: ['./vendors-page.component.css']
})
export class VendorsPageComponent implements OnInit {

  items: string[] = [];

  constructor(private destinyService: DestinyService) { }

  ngOnInit(): void {
    this.destinyService.getVendors()
      .subscribe((res) => {
        if ((<any> res).Response != undefined) {
          const saleItems = (<any> res).Response.sales.data['350061650'].saleItems;          

          for (var saleItem in saleItems) {
            this.items.push(saleItems[saleItem].itemHash);
          }
        }      
      });
  }

}
