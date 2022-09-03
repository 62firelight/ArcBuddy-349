import { Character } from "./Character";

export interface Profile {
    _id: string;
    iconPath: string;
    displayName: string;
    bungieGlobalDisplayNameCode: string;
    membershipType: string;
    membershipId: string;
    
    dateCreated: any;

    characters: Character[];
    mergedStats: Object;
    pveStats: Object;
    pvpStats: Object;
}