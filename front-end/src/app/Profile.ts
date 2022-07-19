import { Character } from "./Character";

export interface Profile {
    Key?: string;

    iconPath: string;
    displayName: string;
    membershipType: string;
    membershipId: string;

    characters: Character[];
    mergedStats: Object;
    pveStats: Object;
    pvpStats: Object;
}