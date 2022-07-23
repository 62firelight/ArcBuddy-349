import { Character } from "./Character";

export interface Profile {
    Key?: string;

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