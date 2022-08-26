import { Component, OnInit } from '@angular/core';
import { DestinyService } from 'src/app/services/destiny.service';
import { ManifestService } from 'src/app/services/manifest.service';

@Component({
  selector: 'app-vendors-page',
  templateUrl: './vendors-page.component.html',
  styleUrls: ['./vendors-page.component.css']
})
export class VendorsPageComponent implements OnInit {

  vendors: Map<any, any[]> = new Map([[{
    "name": "Commander Zavala",
    "largeIcon": "https://www.bungie.net/common/destiny2_content/icons/0a599ca6fad56a014f14475b73a6a1d8.jpg"
  }, [
    {
      "name": "Heroic Projection",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/61501df78712cef806f681b9c168b10d.jpg"
    },
    {
      "name": "High-Risk, High-Reward",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/392146717730b6a9002ff8824ec5d466.jpg"
    },
    {
      "name": "They Were the Champions",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/91121c659c5cc0d8938dfe004426c3fd.jpg"
    },
    {
      "name": "Additional Bounties",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/81488d496b87d7adb212420e21b1469f.jpg"
    },
    {
      "name": "Photosuede Strides",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/79e7d60ece4b8f3bcad5a43d27da13ab.jpg"
    },
    {
      "name": "Long Distance Plan",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/91121c659c5cc0d8938dfe004426c3fd.jpg"
    },
    {
      "name": "Horseshoes and Hand Grenades",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/91121c659c5cc0d8938dfe004426c3fd.jpg"
    },
    {
      "name": "Photosuede Cloak",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/0dca1b12a88e0415c947d5b4c3255e80.jpg"
    },
    {
      "name": "Enhancement Core",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/259c571eb7f9f85e56be657f371e303f.jpg"
    },
    {
      "name": "Photosuede Mask",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/2659e9a8b82888129e61f267d9e9d559.jpg"
    },
    {
      "name": "Chain Gang",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/91121c659c5cc0d8938dfe004426c3fd.jpg"
    },
    {
      "name": "Vanguard Tactician Armor",
      "icon": "https://www.bungie.netundefined"
    },
    {
      "name": "Enhancement Prism",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/0397d34d04b687484f73665bb714227b.jpg"
    },
    {
      "name": "Powerful Gear",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/962055a3f8c73eff98f140f6fac79392.png"
    },
    {
      "name": "Photosuede Vest",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/071f2deb02a03accd24c3836c3748d1d.jpg"
    },
    {
      "name": "Cry Mutiny",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/e217beb03b57ecac1ca69df7e5421981.jpg"
    },
    {
      "name": "Photosuede Grips",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/24139eb2e3cb100370cdf9840abae483.jpg"
    },
    {
      "name": "Vanguard Tactician Arsenal",
      "icon": "https://www.bungie.netundefined"
    },
    {
      "name": "Duskbloom",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/ab4383c4a3b7d929ca9ff248d537ba5c.png"
    },
    {
      "name": "Reset Rank",
      "icon": "https://www.bungie.net/common/destiny2_content/icons/2bd6547fa8f170d8868c8ab24b9fe84a.jpg"
    }
  ]]]);

  // vendors: Map<any, any[]> = new Map();
  hiddenVendors: Set<string> = new Set([
    '3361454721', // Tess Everis
    '1976548992', // Ikora Rey
    '4230408743', // Monument to Lost Lights
    '3484140575', // Quest Archive
    '3347378076' // Suraya Hawthorne
  ]);

  fetchingVendors = false;

  constructor(private destinyService: DestinyService, private manifestService: ManifestService) { }

  ngOnInit(): void {
    // // fetch vendors and the items they sell
    // this.destinyService.getVendors()
    //   .subscribe((res) => {
    //     // get vendor hashes
    //     const towerVendorHashes: string[] = (<any>res).Response.vendorGroups.data.groups['4'].vendorHashes;
    //     const numOfHashes = towerVendorHashes.length;
    //     let numOfHashesIdentified = 0;

    //     // identify each vendor hash
    //     for (let towerVendorHash of towerVendorHashes) {
    //       if (this.hiddenVendors.has(`${towerVendorHash}`)) {
    //         numOfHashesIdentified++;
    //         continue;
    //       }

    //       // retrieve vendor name
    //       this.manifestService.selectFromDefinition('Vendor', towerVendorHash)
    //         .subscribe((vendor) => {
    //           const vendorName = vendor.displayProperties.name;

    //           const newVendor = {
    //             name: vendorName,
    //             largeIcon: `https://www.bungie.net${vendor.displayProperties.largeIcon}`
    //           };

    //           this.vendors.set(newVendor, []);

    //           // store hashes
    //           const saleItems = (<any>res).Response.sales.data[`${towerVendorHash}`].saleItems;
    //           let hashes = [];
    //           for (let saleItem in saleItems) {
    //             hashes.push(saleItems[saleItem].itemHash);
    //           }

    //           // retrieve vendor items
    //           this.manifestService.selectListFromDefinition('InventoryItem', hashes)
    //             .subscribe((vendorItems) => {
    //               this.vendors.set(newVendor, vendorItems);

    //               numOfHashesIdentified++;
    //               if (numOfHashesIdentified >= numOfHashes) {
    //                 this.fetchingVendors = false;
    //                 console.log(this.vendors);
    //               }
    //             });
    //         });
    //     }
    //   });

    // this.fetchingVendors = true;
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