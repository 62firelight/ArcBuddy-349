export interface Character {
    characterId: string;

    race: string;
    class: string;
    light: string | number;
    emblem: string;

    mergedStats?: Object;
    pveStats?: Object;
    pvpStats?: Object;
}