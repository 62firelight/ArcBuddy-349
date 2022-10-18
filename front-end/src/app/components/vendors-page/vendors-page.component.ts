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
import { APIResponse, DestinyDestinationDefinition, DestinyInventoryItemDefinition, DestinyVendorCategory, DestinyVendorComponent, DestinyVendorDefinition, DestinyVendorGroup, DestinyVendorGroupDefinition, DestinyVendorItemQuantity, DestinyVendorSaleItemComponent, DestinyVendorsResponse } from 'quria';

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
  vendorItemCosts: Map<number, DestinyVendorItemQuantity[]> = new Map();
  vendorItemCostDefinitions: Map<number, DestinyInventoryItemDefinition> = new Map();
  vendorLocations: Map<number, DestinyDestinationDefinition> = new Map();
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

  expanded = false;

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
          const vendorGroups: DestinyVendorGroup[] = res.Response.vendorGroups.data.groups;

          // convert 2D number array of vendor hashes to 1D number array
          const vendorHashes: string[] = _.flatten(vendorGroups.map(vendorGroup => vendorGroup.vendorHashes)).map(String);

          // pass on vendor data from manifest + API response
          return forkJoin([this.manifestService.selectListFromDefinition('Vendor', vendorHashes),
          of(res)]);
        }),
        switchMap(array => {
          // retrieve observables from arrayq
          const vendorDefinitions = array[0];
          const res: APIResponse<DestinyVendorsResponse> = array[1];

          // get sale items and categories for all vendors
          const generalData = res.Response.vendors.data;
          const saleItems = res.Response.sales.data;
          const categories = res.Response.categories.data;

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

            // find vendor location
            const vendorGeneralData: DestinyVendorComponent = generalData[towerVendorHash];
            vendorDefinition.vendorLocationIndex = vendorGeneralData.vendorLocationIndex;
            vendorDefinition.vendorLocation = vendorDefinition.locations[vendorDefinition.vendorLocationIndex];

            const vendorCategories: DestinyVendorCategory[] = categories[towerVendorHash].categories;
            const vendorSaleItems: DestinyVendorSaleItemComponent[] = Object.values(saleItems[towerVendorHash].saleItems);

            // create an array of display category indexes
            const displayCategoryIndexes = vendorCategories.map(
              (vendorCategory: { displayCategoryIndex: number; }) => vendorCategory.displayCategoryIndex
            );

            // map display category data from API to display category data from manifest
            let vendorItemsMap = new Map();
            for (const vendorDisplayCategory of vendorDisplayCategories) {
              if (displayCategoryIndexes.includes(vendorDisplayCategory.index)) {
                const matchingVendorCategory = vendorCategories.find(
                  vendorCategory => vendorCategory.displayCategoryIndex == vendorDisplayCategory.index
                );

                if (matchingVendorCategory === undefined) {
                  continue;
                }
                const itemIndexes = matchingVendorCategory.itemIndexes;

                let vendorItems = [];
                for (const itemIndex of itemIndexes) {
                  const vendorItem = vendorSaleItems.find(vendorSaleItem =>
                    vendorSaleItem.vendorItemIndex == itemIndex
                  );

                  if (vendorItem === undefined) {
                    continue;
                  }

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
          const vendorGroups: DestinyVendorGroup[] = res.Response.vendorGroups.data.groups;
          const vendorGroupHashes: string[] = vendorGroups.map(vendorGroup => vendorGroup.vendorGroupHash).map(String);
          const vendorDestinationHashes: string[] = Array.from(vendorsMap.keys()).map(vendor => vendor.vendorLocation.destinationHash);

          // pass on vendor group data from manifest + current vendor map + API response
          return forkJoin([this.manifestService.selectListFromDefinition('VendorGroup', vendorGroupHashes), 
          this.manifestService.selectListFromDefinition('Destination', vendorDestinationHashes),
          of(vendorsMap), of(res), of(vendorItemCostsMap)]);
        }),
        switchMap(array => {
          // retrieve observables from array
          const vendorGroupDefinitions = array[0];
          const vendorDestinationDefinitions: DestinyDestinationDefinition[] = array[1];
          const vendorsMap = array[2];
          const res: APIResponse<DestinyVendorsResponse> = array[3];
          const vendorItemCostsMap = array[4];

          const vendorGroups: DestinyVendorGroup[] = res.Response.vendorGroups.data.groups;

          // divide vendors into vendor groups
          let vendorGroupsMap: Map<DestinyVendorGroupDefinition, Map<DestinyVendorDefinition, Map<string, DestinyInventoryItemDefinition[]>>[]> = new Map();
          let vendorLocations: Map<number, DestinyDestinationDefinition> = new Map();
          for (const vendorGroup of vendorGroups) {
            const vendorGroupDefinition = vendorGroupDefinitions.find(vendorGroupDefinition => vendorGroupDefinition.hash == vendorGroup.vendorGroupHash);
            const vendorHashes = vendorGroup.vendorHashes;

            for (const [vendor, categories] of vendorsMap.entries()) {
              if (vendorHashes.includes(vendor.hash)) {
                // map vendor location
                const vendorLocation = vendorDestinationDefinitions.find(vendorDestinationDefiniton => vendor.vendorLocation.destinationHash == vendorDestinationDefiniton.hash);
                // vendor.vendorLocation = vendorLocation;
                if (vendorLocation != undefined) {
                  vendorLocations.set(vendor.hash, vendorLocation);
                }

                let vendorsInVendorGroup = vendorGroupsMap.get(vendorGroupDefinition);
                if (vendorsInVendorGroup === undefined) {
                  vendorsInVendorGroup = [];
                }
                vendorsInVendorGroup.push(new Map([[vendor, categories]]));

                vendorGroupsMap.set(vendorGroupDefinition, vendorsInVendorGroup);
              }
            }
          }

          // get a list of all item hashes
          let allItemHashes: string[] = [];
          Array.from(vendorsMap.values()).forEach(vendorItemsMap => {
            // retrieve 2D array containing item indexes arrays
            const vendorItemArrays: DestinyVendorSaleItemComponent[][] = Array.from(vendorItemsMap.values());

            // convert 2D array into 1D array
            const vendorItems: DestinyVendorSaleItemComponent[] = _.flatten(vendorItemArrays);

            // retrieve all item hashes and store in 1D array
            const vendorItemHashes: string[] = vendorItems.map(vendorItem => vendorItem.itemHash).map(String);

            allItemHashes = allItemHashes.concat(vendorItemHashes);
          });

          return forkJoin([this.manifestService.selectListFromDefinition('InventoryItem', allItemHashes),
          of(vendorsMap), of(vendorGroupsMap), of(vendorItemCostsMap), of(vendorLocations)]);
        }),
        switchMap(array => {
          // retrieve observables from array
          const itemDefinitions = array[0];
          const vendorsMap = array[1];
          const vendorGroupsMap = array[2];
          const vendorItemCostsMap = array[3];
          const vendorLocations = array[4];

          // create an object containing item hash keys and item definition values
          let itemDefinitionsObj: { [key: string]: DestinyInventoryItemDefinition } = {};
          for (var i = 0; i < itemDefinitions.length; i++) {
            itemDefinitionsObj[itemDefinitions[i].hash] = itemDefinitions[i];
          }

          // map item data from API to item data in manifest
          for (const vendorName of vendorsMap.keys()) {
            const vendorItemsMap = vendorsMap.get(vendorName);
            for (const vendorCategory of vendorItemsMap.keys()) {
              const vendorCategoryItems = vendorItemsMap.get(vendorCategory);

              let indexesToDelete: number[] = [];
              vendorCategoryItems.forEach((vendorCategoryItem: DestinyVendorSaleItemComponent, index: number) => {
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

          // retrieve hashes for currencies
          const vendorItemCosts: any[] = Array.from(vendorItemCostsMap.values());
          const allVendorItemCosts: any[] = [].concat(...vendorItemCosts);
          const allVendorItemCostHashes = allVendorItemCosts.map((allVendorItemCost) => 
            allVendorItemCost.itemHash
          );

          return forkJoin([this.manifestService.selectListFromDefinition('InventoryItem', allVendorItemCostHashes),
            of(vendorGroupsMap), of(vendorItemCostsMap), of(vendorLocations)]);
        }),
        switchMap(array => {
          const allVendorItemCostDefinitions = array[0];
          const vendorGroupsMap = array[1];
          const vendorItemCostsMap = array[2];
          const vendorLocations = array[3];

          // store item cost definitions in corresponding map
          let vendorItemCostDefinitions: Map<number, any> = new Map();
          for (const vendorItemCostArray of vendorItemCostsMap.values()) {
            for (const vendorItemCost of vendorItemCostArray) {
              const costDefinition = allVendorItemCostDefinitions.find((definition) => definition.hash == vendorItemCost.itemHash);

              vendorItemCostDefinitions.set(vendorItemCost.itemHash, costDefinition);
            }
          }

          return forkJoin([of(vendorGroupsMap), of(vendorItemCostsMap), of(vendorItemCostDefinitions), of(vendorLocations)]);
        })
      )
      .subscribe(array => {
        const vendorGroups = array[0];
        const vendorItemCostsMap = array[1];
        const vendorItemCostDefinitions = array[2];
        const vendorLocations = array[3];

        this.vendorGroups = vendorGroups;
        this.vendorItemCosts = vendorItemCostsMap;
        this.vendorItemCostDefinitions = vendorItemCostDefinitions;
        this.vendorLocations = vendorLocations;

        console.log(this.vendorItemCosts);

        this.error = false;

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