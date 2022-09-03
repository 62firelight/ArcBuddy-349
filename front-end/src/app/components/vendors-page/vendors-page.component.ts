import { Component, OnInit, ViewChild } from '@angular/core';
import { DestinyService } from 'src/app/services/destiny.service';
import { ManifestService } from 'src/app/services/manifest.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { forkJoin } from 'rxjs/index';
import * as _ from 'lodash';
import { KeyValue } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-vendors-page',
  templateUrl: './vendors-page.component.html',
  styleUrls: ['./vendors-page.component.css'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        // fade in
        transition(
          ':enter', 
          [
            style({ height: 0, opacity: 0 }),
            animate('0.5s ease-out', 
                    style({ }))
          ]
        ),
        // fade out
        transition(
          ':leave', 
          [
            style({ }),
            animate('0.25s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class VendorsPageComponent implements OnInit {

  vendorGroups: Map<any, Map<any, Map<any, any[]>>[]> = new Map();
  vendorItemCosts: Map<any, any> = new Map();
  vendors: Map<any, Map<any, any[]>> = new Map();
  hiddenVendors: Set<string> = new Set([
    '3361454721', // Tess Everis
    '1976548992', // Ikora Rey
    '4230408743', // Monument to Lost Lights
    '3484140575', // Quest Archive
    '3347378076' // Suraya Hawthorne
  ]);
  hiddenItems: Set<string> = new Set([
    '2056267440', // HELP (Crown of Sorrow)
    '1996058196', // Upgrades (Crown of Sorrow)
    '2528467705', // Upgrades (War Table)
    '645883292', // HELP (Star Chart)
    '3660745864', // Pirate Crew (Star Chart)
    '1425038744' // Sabotage (Variks the Loyal)
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
          let vendorItemCostsMap = new Map();
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

                  // skip specific vendor items
                  if (this.hiddenItems.has(`${vendorItem.itemHash}`)) {
                    continue;
                  }

                  vendorItems.push(vendorItem);

                  vendorItemCostsMap.set(vendorItem.itemHash, vendorItem.costs);
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
          of(vendorsMap), of(res), of(vendorItemCostsMap)]);
        }),
        switchMap(array => {
          // retrieve observables from array
          const vendorGroupDefinitions = array[0];
          const vendorsMap = array[1];
          const res = array[2];
          const vendorItemCostsMap = array[3];

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
          of(vendorsMap), of(vendorGroupsMap), of(vendorItemCostsMap)]);
        }),
        switchMap(array => {
          // retrieve observables from array
          const itemDefinitions = array[0];
          const vendorsMap = array[1];
          const vendorGroupsMap = array[2];
          const vendorItemCostsMap = array[3];

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

                // replace entry in map
                const itemCosts = vendorItemCostsMap.get(itemHash);
                vendorItemCostsMap.delete(itemHash);
                vendorItemCostsMap.set(itemDefinition.hash, itemCosts);

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

          const vendorItemCosts: any[] = Array.from(vendorItemCostsMap.values());
          const allVendorItemCosts: any[] = [].concat(...vendorItemCosts);
          const allVendorItemCostHashes = allVendorItemCosts.map((allVendorItemCost) => 
            allVendorItemCost.itemHash
          );

          return forkJoin([this.manifestService.selectListFromDefinition('InventoryItem', allVendorItemCostHashes),
            of(vendorGroupsMap), of(vendorItemCostsMap)]);
        }),
        switchMap(array => {
          const allVendorItemCostDefinitions = array[0];
          const vendorGroupsMap = array[1];
          const vendorItemCostsMap = array[2];

          // add on definition properties to each item cost object
          for (const vendorItemCostArray of vendorItemCostsMap.values()) {
            for (const vendorItemCost of vendorItemCostArray) {
              const costDefinition = allVendorItemCostDefinitions.find((definition) => definition.hash == vendorItemCost.itemHash);

              vendorItemCost.definition = costDefinition;
            }
          }

          return forkJoin([of(vendorGroupsMap), of(vendorItemCostsMap)]);
        })
      )
      .subscribe(array => {
        const vendorGroups = array[0];
        const vendorItemCostsMap = array[1];

        this.error = false;
        this.vendorGroups = vendorGroups;
        this.vendorItemCosts = vendorItemCostsMap;

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