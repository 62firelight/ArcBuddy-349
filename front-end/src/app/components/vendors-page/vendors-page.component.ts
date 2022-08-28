import { Component, OnInit } from '@angular/core';
import { DestinyService } from 'src/app/services/destiny.service';
import { ManifestService } from 'src/app/services/manifest.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs/index';
import * as _ from 'lodash';
import { isObjectLike } from 'lodash';

@Component({
  selector: 'app-vendors-page',
  templateUrl: './vendors-page.component.html',
  styleUrls: ['./vendors-page.component.css']
})
export class VendorsPageComponent implements OnInit {

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
    // fetch vendors and the items they sell
    // TODO: Add error handling
    this.destinyService.getVendors()
      .pipe(
        switchMap(res => {
          // get vendor hashes
          const towerVendorHashes: string[] = (<any>res).Response.vendorGroups.data.groups['4'].vendorHashes;
          const sales = (<any>res).Response.sales.data;
          const categories = (<any>res).Response.categories.data

          return forkJoin([this.manifestService.selectListFromDefinition('Vendor', towerVendorHashes),
          // this.manifestService.selectListFromDefinition('InventoryItem', Array.from(hashesMap.values())),
          of(towerVendorHashes), of(sales), of(categories)]);
          // TODO: reduce number of observables in array (as we can extract the parts we need from the response later)
        }),
        switchMap(array => {
          // retrieve observables from array
          const vendorDefinitions = array[0];
          const towerVendorHashes = array[1];
          const sales = array[2];
          const categories = array[3];

          // for each vendor, find its categories and corresponding items
          let vendorsMap = new Map();
          for (const vendorDefinition of vendorDefinitions) {
            const towerVendorHash = vendorDefinition.hash;

            // skip specific vendors
            if (this.hiddenVendors.has(`${towerVendorHash}`)) {
              continue;
            }

            const vendorDisplayCategories = vendorDefinition.displayCategories;
            const vendorCategories: any[] = categories[towerVendorHash].categories;
            const vendorSaleItems: any[] = Object.values(sales[towerVendorHash].saleItems);

            const displayCategoryIndexes = vendorCategories.map(
              (vendorCategory: { displayCategoryIndex: any; }) => vendorCategory.displayCategoryIndex
            );

            // map display categories from API data to display categories from manifest data
            let vendorItemsMap = new Map();
            for (const vendorDisplayCategory of vendorDisplayCategories) {
              if (displayCategoryIndexes.includes(vendorDisplayCategory.index)) {
                const itemIndexes = vendorCategories.find(
                  vendorCategory => vendorCategory.displayCategoryIndex == vendorDisplayCategory.index
                ).itemIndexes;

                let vendorItems = [];
                for (const itemIndex of itemIndexes) {
                  const vendorItem = vendorSaleItems.find(vendorSaleItem =>
                    (<any>vendorSaleItem).vendorItemIndex == itemIndex
                  );
                  vendorItems.push(vendorItem);
                }
                vendorItemsMap.set(vendorDisplayCategory.displayProperties.name, _.cloneDeep(vendorItems));
                vendorItems = [];
              } else {
                continue;
              }
            }
            vendorsMap.set(vendorDefinition, vendorItemsMap);
          }

          // get a list of all item hashes
          let allItemHashes: any[] = [];
          Array.from(vendorsMap.values()).forEach(vendorItemsMap => {
            // retrieve 2D array containing item indexes arrays
            const vendorItemArrays: any[] = Array.from(vendorItemsMap.values());

            // convert 2D array into 1D array
            const vendorItems: any[] = [].concat(...vendorItemArrays);

            // retrieve all item hashes and store in 1D array
            const vendorItemHashes = vendorItems.map(vendorItem => vendorItem.itemHash);

            allItemHashes = allItemHashes.concat(vendorItemHashes);
          });

          return forkJoin([this.manifestService.selectListFromDefinition('InventoryItem', allItemHashes),
            of(vendorsMap)]);
        }),
        switchMap(array => {
          // retrieve observables from array
          const itemDefinitions = array[0];
          const vendorsMap = array[1];

          let itemDefinitionsObj: { [key: string]: any } = {};
          for (var i = 0; i < itemDefinitions.length; i++) {
            itemDefinitionsObj[itemDefinitions[i].hash] = itemDefinitions[i];
          }

          for (const vendorName of vendorsMap.keys()) {
            const vendorItemsMap = vendorsMap.get(vendorName);
            for (const vendorCategory of vendorItemsMap.keys()) {
              const vendorCategoryItems = vendorItemsMap.get(vendorCategory)

              vendorCategoryItems.forEach((vendorCategoryItem: any, index: number) => {
                const itemHash = vendorCategoryItem.itemHash;

                vendorCategoryItems[index] = itemDefinitionsObj[itemHash];
              });
            }
          }

          return of(vendorsMap);
        })
      )
      .subscribe(result => {
        this.vendors = result;

        console.log(result);

        this.fetchingVendors = false;
      });

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

    //       const categories = (<any>res).Response.categories.data[towerVendorHash].categories;

    //       // retrieve vendor name
    //       this.manifestService.selectFromDefinition('Vendor', towerVendorHash)
    //         .subscribe((vendor) => {

    //           const displayCategories = vendor.displayCategories;

    //           // map the vendor's display category names to item indexes
    //           for (let category of categories) {
    //             const displayCategoryIndex = category.displayCategoryIndex;

    //             const originalSize = categoriesMap.size;
    //             for (let displayCategory of displayCategories) {
    //               if (displayCategory.index == displayCategoryIndex) {
    //                 categoriesMap.set(displayCategory.displayProperties.name, category.itemIndexes);
    //                 break;
    //               }
    //             }
    //           }

    //           const newVendor = {
    //             name: vendor.displayProperties.name,
    //             subtitle: vendor.displayProperties.subtitle,
    //             largeIcon: `https://www.bungie.net${vendor.displayProperties.largeIcon}`
    //           };

    //           this.vendors.set(newVendor, new Map());

    //           const saleItems = (<any>res).Response.sales.data[`${towerVendorHash}`].saleItems;

    //           let hashesMap = new Map();

    //           // store hashes
    //           let hashes = [];
    //           for (let saleItem in saleItems) {
    //             hashesMap.set(saleItems[saleItem].itemHash, saleItem);
    //             hashes.push(saleItems[saleItem].itemHash);
    //           }

    //           // retrieve vendor items
    //           this.manifestService.selectListFromDefinition('InventoryItem', hashes)
    //             .subscribe((vendorItems) => {

    //               let itemsMap = new Map();
    //               for (const vendorItem of vendorItems) {
    //                 // let items = [];

    //                 // console.log(vendorItem);
    //                 const itemIndex = parseInt(hashesMap.get(vendorItem.hash));
    //                 // console.log(itemIndex);

    //                 for (const [category, itemIndexes] of categoriesMap) {
    //                   // console.log(`${itemIndexes} includes ${itemIndex}? ${itemIndexes.includes(itemIndex)}`);                    
    //                   if (itemIndexes.includes(itemIndex)) {
    //                     let items = itemsMap.get(category);
    //                     if (items === undefined) {
    //                       items = [];
    //                     }

    //                     items.push(vendorItem);
    //                     itemsMap.set(category, items);
    //                     break;
    //                   }
    //                 }
    //                 // console.log(itemsMap);
    //               }
    //               this.vendors.set(newVendor, itemsMap);
    //               // this.vendors.set(newVendor, vendorItems);

    //               numOfHashesIdentified++;
    //               if (numOfHashesIdentified >= numOfHashes) {
    //                 this.fetchingVendors = false;
    //                 console.log(this.vendors);
    //               }
    //             });
    //         });
    //     }
    //   });

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