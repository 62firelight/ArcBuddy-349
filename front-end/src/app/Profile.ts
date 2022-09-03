import { Character } from "./Character";

export interface Profile {
    _id: string;
    iconPath: string;
    displayName: string;
    bungieGlobalDisplayNameCode: number;
    membershipType: string;
    membershipId: string;
    
    dateCreated: any;

    characters: Character[];
    mergedStats: Object;
    pveStats: Object;
    pvpStats: Object;
}