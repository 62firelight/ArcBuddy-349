export interface Character {
    characterId: string;

    race: string;
    class: string;
    light: string;
    emblem: string;

    mergedStats?: Object;
    pveStats?: Object;
    pvpStats?: Object;
}