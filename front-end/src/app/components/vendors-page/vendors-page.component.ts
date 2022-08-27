import { Component, OnInit } from '@angular/core';
import { DestinyService } from 'src/app/services/destiny.service';
import { ManifestService } from 'src/app/services/manifest.service';

@Component({
  selector: 'app-vendors-page',
  templateUrl: './vendors-page.component.html',
  styleUrls: ['./vendors-page.component.css']
})
export class VendorsPageComponent implements OnInit {

  // vendors: Map<any, Map<any, any[]>> = new Map(
  //   [
  //     [
  //       {
  //         "name": "Commander Zavala",
  //         "subtitle": "Titan Vanguard",
  //         "largeIcon": "https://www.bungie.net/common/destiny2_content/icons/0a599ca6fad56a014f14475b73a6a1d8.jpg"
  //       },
  //       new Map([
  //         [
  //           "Rank Rewards",
  //           [
  //             {
  //               "name": "Heroic Projection",
  //               "hash": 2199880738,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/61501df78712cef806f681b9c168b10d.jpg"
  //             },
  //             {
  //               "name": "Enhancement Core",
  //               "hash": 3853748946,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/259c571eb7f9f85e56be657f371e303f.jpg"
  //             },
  //             {
  //               "name": "Enhancement Prism",
  //               "hash": 4257549984,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/0397d34d04b687484f73665bb714227b.jpg"
  //             },
  //             {
  //               "name": "Powerful Gear",
  //               "hash": 277576667,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/962055a3f8c73eff98f140f6fac79392.png"
  //             },
  //             {
  //               "name": "Cry Mutiny",
  //               "hash": 616582330,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/e217beb03b57ecac1ca69df7e5421981.jpg"
  //             },
  //             {
  //               "name": "Duskbloom",
  //               "hash": 1902811978,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/ab4383c4a3b7d929ca9ff248d537ba5c.png"
  //             },
  //             {
  //               "name": "Reset Rank",
  //               "hash": 2133694745,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/2bd6547fa8f170d8868c8ab24b9fe84a.jpg"
  //             }
  //           ]
  //         ],
  //         [
  //           "Quests",
  //           [
  //             {
  //               "name": "High-Risk, High-Reward",
  //               "hash": 2390666069,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/392146717730b6a9002ff8824ec5d466.jpg"
  //             }
  //           ]
  //         ],
  //         [
  //           "Bounties",
  //           [
  //             {
  //               "name": "They Were the Champions",
  //               "hash": 2852283123,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/91121c659c5cc0d8938dfe004426c3fd.jpg"
  //             },
  //             {
  //               "name": "Additional Bounties",
  //               "hash": 2910071312,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/81488d496b87d7adb212420e21b1469f.jpg"
  //             },
  //             {
  //               "name": "Long Distance Plan",
  //               "hash": 2987639079,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/91121c659c5cc0d8938dfe004426c3fd.jpg"
  //             },
  //             {
  //               "name": "Horseshoes and Hand Grenades",
  //               "hash": 3671936696,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/91121c659c5cc0d8938dfe004426c3fd.jpg"
  //             },
  //             {
  //               "name": "Chain Gang",
  //               "hash": 4145290890,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/91121c659c5cc0d8938dfe004426c3fd.jpg"
  //             }
  //           ]
  //         ],
  //         [
  //           "Featured Armor",
  //           [
  //             {
  //               "name": "Photosuede Strides",
  //               "hash": 2949791538,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/79e7d60ece4b8f3bcad5a43d27da13ab.jpg"
  //             },
  //             {
  //               "name": "Photosuede Cloak",
  //               "hash": 3691455821,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/0dca1b12a88e0415c947d5b4c3255e80.jpg"
  //             },
  //             {
  //               "name": "Photosuede Mask",
  //               "hash": 4076604385,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/2659e9a8b82888129e61f267d9e9d559.jpg"
  //             },
  //             {
  //               "name": "Photosuede Vest",
  //               "hash": 469333264,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/071f2deb02a03accd24c3836c3748d1d.jpg"
  //             },
  //             {
  //               "name": "Photosuede Grips",
  //               "hash": 619556600,
  //               "icon": "https://www.bungie.net/common/destiny2_content/icons/24139eb2e3cb100370cdf9840abae483.jpg"
  //             }
  //           ]
  //         ],
  //         [
  //           "Armor",
  //           [
  //             {
  //               "name": "Vanguard Tactician Armor",
  //               "hash": 4252280581,
  //               "icon": "https://www.bungie.netundefined"
  //             },
  //             {
  //               "name": "Vanguard Tactician Arsenal",
  //               "hash": 1616736576,
  //               "icon": "https://www.bungie.netundefined"
  //             }
  //           ]
  //         ]
  //       ])
  //     ]
  //   ]);

  vendors: Map<any, Map<any, any[]>> = new Map();
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
    let categoriesMap = new Map();

    // fetch vendors and the items they sell
    this.destinyService.getVendors()
      .subscribe((res) => {
        // get vendor hashes
        const towerVendorHashes: string[] = (<any>res).Response.vendorGroups.data.groups['4'].vendorHashes;
        const numOfHashes = towerVendorHashes.length;
        let numOfHashesIdentified = 0;

        // identify each vendor hash
        for (let towerVendorHash of towerVendorHashes) {
          if (this.hiddenVendors.has(`${towerVendorHash}`)) {
            numOfHashesIdentified++;
            continue;
          }

          const categories = (<any>res).Response.categories.data[towerVendorHash].categories;

          // retrieve vendor name
          this.manifestService.selectFromDefinition('Vendor', towerVendorHash)
            .subscribe((vendor) => {

              const displayCategories = vendor.displayCategories;

              // map the vendor's display category names to item indexes
              for (let category of categories) {
                const displayCategoryIndex = category.displayCategoryIndex;

                const originalSize = categoriesMap.size;
                for (let displayCategory of displayCategories) {
                  if (displayCategory.index == displayCategoryIndex) {
                    categoriesMap.set(displayCategory.displayProperties.name, category.itemIndexes);
                    break;
                  }
                }

                // if (originalSize == categoriesMap.size) {

                // }
              }

              const newVendor = {
                name: vendor.displayProperties.name,
                subtitle: vendor.displayProperties.subtitle,
                largeIcon: `https://www.bungie.net${vendor.displayProperties.largeIcon}`
              };

              this.vendors.set(newVendor, new Map());

              const saleItems = (<any>res).Response.sales.data[`${towerVendorHash}`].saleItems;

              let hashesMap = new Map();

              // store hashes
              let hashes = [];
              for (let saleItem in saleItems) {
                hashesMap.set(saleItems[saleItem].itemHash, saleItem);
                hashes.push(saleItems[saleItem].itemHash);
              }

              // retrieve vendor items
              this.manifestService.selectListFromDefinition('InventoryItem', hashes)
                .subscribe((vendorItems) => {

                  let itemsMap = new Map();
                  for (const vendorItem of vendorItems) {
                    // let items = [];

                    // console.log(vendorItem);
                    const itemIndex = parseInt(hashesMap.get(vendorItem.hash));
                    // console.log(itemIndex);

                    for (const [category, itemIndexes] of categoriesMap) {
                      // console.log(`${itemIndexes} includes ${itemIndex}? ${itemIndexes.includes(itemIndex)}`);                    
                      if (itemIndexes.includes(itemIndex)) {
                        let items = itemsMap.get(category);
                        if (items === undefined) {
                          items = [];
                        }

                        items.push(vendorItem);
                        itemsMap.set(category, items);
                        break;
                      }
                    }
                    // console.log(itemsMap);
                  }
                  this.vendors.set(newVendor, itemsMap);
                  // this.vendors.set(newVendor, vendorItems);

                  numOfHashesIdentified++;
                  if (numOfHashesIdentified >= numOfHashes) {
                    this.fetchingVendors = false;
                    console.log(this.vendors);
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