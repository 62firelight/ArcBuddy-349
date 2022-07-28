import { Character } from "./Character";

export interface Profile {
    _id: string;
    iconPath: string;
    displayName: string;
    membershipType: string;
    membershipId: string;
    
    dateCreated: Date;

    characters: Character[];
    mergedStats: Object;
    pveStats: Object;
    pvpStats: Object;
}