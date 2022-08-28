import { Component, OnInit } from '@angular/core';
import { DestinyService } from 'src/app/services/destiny.service';
import { ManifestService } from 'src/app/services/manifest.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs/index';
import * as _ from 'lodash';

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

          // pass on vendor data from manifest + API response
          return forkJoin([this.manifestService.selectListFromDefinition('Vendor', towerVendorHashes),
          of(res)]);
        }),
        switchMap(array => {
          // retrieve observables from array
          const vendorDefinitions = array[0];
          const res = array[1];

          // get sale items and categories for all vendors
          const saleItems = (<any>res).Response.sales.data;
          const categories = (<any>res).Response.categories.data;

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
            const vendorSaleItems: any[] = Object.values(saleItems[towerVendorHash].saleItems);

            // create an array of display category indexes
            const displayCategoryIndexes = vendorCategories.map(
              (vendorCategory: { displayCategoryIndex: any; }) => vendorCategory.displayCategoryIndex
            );

            // map display category data from API to display category data from manifest
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

          // create an object containing item hash keys and item definition values
          let itemDefinitionsObj: { [key: string]: any } = {};
          for (var i = 0; i < itemDefinitions.length; i++) {
            itemDefinitionsObj[itemDefinitions[i].hash] = itemDefinitions[i];
          }

          // map item data from API to item data in manifest
          for (const vendorName of vendorsMap.keys()) {
            const vendorItemsMap = vendorsMap.get(vendorName);
            for (const vendorCategory of vendorItemsMap.keys()) {
              const vendorCategoryItems = vendorItemsMap.get(vendorCategory);

              let indexesToDelete: number[] = [];
              vendorCategoryItems.forEach((vendorCategoryItem: any, index: number) => {
                const itemHash = vendorCategoryItem.itemHash;
                const itemDefinition = itemDefinitionsObj[itemHash];

                vendorCategoryItems[index] = itemDefinition;

                // mark item for deletion if there is no icon
                if (itemDefinition.displayProperties.hasIcon == false) {
                  indexesToDelete.push(index);
                }
              });

              // delete any marked items (and the category if corresponding array value is empty)
              _.pullAt(vendorCategoryItems, indexesToDelete);
              if (vendorCategoryItems.length <= 0) {
                vendorItemsMap.delete(vendorCategory);
              }
            }
          }

          return of(vendorsMap);
        })
      )
      .subscribe(result => {
        this.vendors = result;
        this.fetchingVendors = false;
      });

    this.fetchingVendors = true;
  }

}