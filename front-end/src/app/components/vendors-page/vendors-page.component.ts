import { Component, OnInit, ViewChild } from '@angular/core';
import { DestinyService } from 'src/app/services/destiny.service';
import { ManifestService } from 'src/app/services/manifest.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs/index';
import * as _ from 'lodash';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { KeyValue } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-vendors-page',
  templateUrl: './vendors-page.component.html',
  styleUrls: ['./vendors-page.component.css']
})
export class VendorsPageComponent implements OnInit {

  vendorGroups: Map<any, Map<any, Map<any, any[]>>[]> = new Map();
  vendors: Map<any, Map<any, any[]>> = new Map();
  hiddenVendors: Set<string> = new Set([
    '3361454721', // Tess Everis
    '1976548992', // Ikora Rey
    '4230408743', // Monument to Lost Lights
    '3484140575', // Quest Archive
    '3347378076' // Suraya Hawthorne
  ]);
  fetchingVendors = false;
  error = false;

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  constructor(private destinyService: DestinyService, private manifestService: ManifestService) { }

  ngOnInit(): void {
    // fetch vendors and the items they sell
    // TODO: Add error handling
    this.destinyService.getVendors()
      .pipe(
        switchMap(res => {
          // get all vendor hashes converted from a 2D array to a 1D array
          const vendorGroups: any[] = (<any>res).Response.vendorGroups.data.groups;
          const vendorHashes: any[] = [].concat(...vendorGroups.map(vendorGroup => vendorGroup.vendorHashes));

          // pass on vendor data from manifest + API response
          return forkJoin([this.manifestService.selectListFromDefinition('Vendor', vendorHashes),
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
            // break;
          }

          // look up vendor group hashes in manifest
          const vendorGroups: any[] = (<any>res).Response.vendorGroups.data.groups;
          const vendorGroupHashes: any[] = vendorGroups.map(vendorGroup => vendorGroup.vendorGroupHash);

          // pass on vendor group data from manifest + current vendor map + API response
          return forkJoin([this.manifestService.selectListFromDefinition('VendorGroup', vendorGroupHashes),
          of(vendorsMap), of(res)]);
        }),
        switchMap(array => {
          // retrieve observables from array
          const vendorGroupDefinitions = array[0];
          const vendorsMap = array[1];
          const res = array[2];

          const vendorGroups: any[] = (<any>res).Response.vendorGroups.data.groups;

          // divide vendors into vendor groups
          let vendorGroupsMap: Map<any, Map<any, Map<any, any[]>>[]> = new Map();
          for (const vendorGroup of vendorGroups) {
            const vendorGroupDefinition = vendorGroupDefinitions.find(vendorGroupDefinition => vendorGroupDefinition.hash == vendorGroup.vendorGroupHash);
            const vendorHashes = vendorGroup.vendorHashes;

            for (const [vendor, categories] of vendorsMap.entries()) {
              if (vendorHashes.includes(vendor.hash)) {
                let vendorsInVendorGroup: Map<any, Map<any, any[]>>[] | undefined = vendorGroupsMap.get(vendorGroupDefinition);
                if (vendorsInVendorGroup === undefined) {
                  vendorsInVendorGroup = [];
                }
                vendorsInVendorGroup.push(new Map([[vendor, categories]]));

                vendorGroupsMap.set(vendorGroupDefinition, vendorsInVendorGroup);
              }
            }
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
          of(vendorsMap), of(vendorGroupsMap)]);
        }),
        switchMap(array => {
          // retrieve observables from array
          const itemDefinitions = array[0];
          const vendorsMap = array[1];
          const vendorGroupsMap = array[2];

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

          return of(vendorGroupsMap);
        })
      )
      .subscribe(result => {
        this.error = false;
        this.vendorGroups = result;
        this.fetchingVendors = false;
      }, 
      err => {
        this.error = true;       
      });

    this.fetchingVendors = true;
  }

  // Order by ascending order of vendor group
  vendorGroupAscOrder = (a: KeyValue<any, Map<any, Map<any, any[]>>[]>, b: KeyValue<any, Map<any, Map<any, any[]>>[]>): number => {
    return a.key.order > b.key.order ? 1 : (b.key.order > a.key.order ? -1 : 0);
  }

}