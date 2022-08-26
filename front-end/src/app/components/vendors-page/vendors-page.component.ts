import { Component, OnInit } from '@angular/core';
import { DestinyService } from 'src/app/services/destiny.service';
import { ManifestService } from 'src/app/services/manifest.service';

@Component({
  selector: 'app-vendors-page',
  templateUrl: './vendors-page.component.html',
  styleUrls: ['./vendors-page.component.css']
})
export class VendorsPageComponent implements OnInit {

  vendors: Map<string, any[]> = new Map();
  hiddenVendors: Set<string> = new Set([
    '3361454721', // Tess Everis
    '1976548992', // Ikora Rey
    '4230408743', // Monument to Lost Lights
    '3484140575' // Quest Archive
  ]);

  fetchingVendors = true;

  constructor(private destinyService: DestinyService, private manifestService: ManifestService) { }

  ngOnInit(): void {
    // fetch vendors and the items they sell
    this.destinyService.getVendors()
      .subscribe((res) => {
        // get vendor hashes
        const towerVendorHashes: string[] = (<any>res).Response.vendorGroups.data.groups['3'].vendorHashes;
        const numOfHashes = towerVendorHashes.length;        
        let numOfHashesIdentified = 0;

        // identify each vendor hash
        for (let towerVendorHash of towerVendorHashes) {
          if (this.hiddenVendors.has(`${towerVendorHash}`)) {
            numOfHashesIdentified++;
            continue;
          }

          // retrieve vendor name
          this.manifestService.selectFromDefinition('Vendor', towerVendorHash)
            .subscribe((vendor) => {
              const vendorName = vendor.displayProperties.name;
              this.vendors.set(vendorName, []);

              // store hashes
              const saleItems = (<any>res).Response.sales.data[`${towerVendorHash}`].saleItems;
              let hashes = [];
              for (let saleItem in saleItems) {
                hashes.push(saleItems[saleItem].itemHash);
              }

              // retrieve vendor items
              this.manifestService.selectListFromDefinition('InventoryItem', hashes)
                .subscribe((vendorItems) => {
                  this.vendors.set(vendorName, vendorItems);

                  numOfHashesIdentified++;
                  console.log(`Number of identified hashes: ${numOfHashesIdentified}`);
                  console.log(`Number of hashes left: ${numOfHashesIdentified - numOfHashes}`);
                  if (numOfHashesIdentified >= numOfHashes) {
                    this.fetchingVendors = false;
                  }
                });
            });
        }
      });

      this.fetchingVendors = true;
  }

}

// code for individual item retrievals 
// this.manifestService.selectFromDefinition('InventoryItem', saleItems)
//     .subscribe((res) => {
//       console.log(res);
//       // this.vendorItems = res;
//     });
// for (let saleItem in saleItems) {
//   this.manifestService.selectFromDefinition('InventoryItem', saleItems[saleItem].itemHash)
//     .subscribe((res) => {
//       let item = {
//         name: res.displayProperties.name,
//         icon: `https://www.bungie.net${res.displayProperties.icon}`
//       };

//       let vendorItems = this.vendors.get(vendorName);
//       if (vendorItems === undefined) {
//         return;
//       }

//       vendorItems.push(item);
//     });

// }