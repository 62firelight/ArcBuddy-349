import { KeyValue } from "@angular/common";

export class Helper {
    static sections = new Map([
        ['General',
            new Map([
                ['secondsPlayed', 'Time Played'],
                ['killsDeathsRatio', "KD Ratio"],
                ['kills', 'Kills'],
                ['assists', 'Assists'],
                ['deaths', 'Deaths'],
                ['efficiency', 'Efficiency'],
                ['activitiesCleared', 'Activites Cleared (PvE)'],
                ['activitiesEntered', 'Activites Entered'],
                ['precisionKills', 'Precision Kills'],
                ['weaponKillsSuper', 'Super Kills'],
                ['weaponKillsGrenade', 'Grenade Kills'],
                ['weaponKillsMelee', 'Melee Kills']
                // ['publicEventsCompleted', 'Public Events Completed']
            ])
        ],
        ['Weapon Kills',
            new Map([
                ['weaponKillsAutoRifle', 'Auto Rifle'],
                // ['weaponKillsBeamRifle', 'Beam Rifle'],
                ['weaponKillsPulseRifle', 'Pulse Rifle'],
                ['weaponKillsScoutRifle', 'Scout Rifle'],
                ['weaponKillsHandCannon', 'Hand Cannon'],
                ['weaponKillsSubmachinegun', 'Submachine Gun'],
                ['weaponKillsSideArm', 'Sidearm'],
                ['weaponKillsBow', 'Bow'],
                ['weaponKillsGlaive', 'Glaive'],
                ['weaponKillsFusionRifle', 'Fusion Rifle'],
                ['weaponKillsTraceRifle', 'Trace Rifle'],
                ['weaponKillsShotgun', 'Shotgun'],
                ['weaponKillsSniper', 'Sniper Rifle'],
                ['weaponKillsMachineGun', 'Machine Gun'],
                ['weaponKillsRocketLauncher', 'Rocket Launcher'],
                // ['weaponKillsRelic', 'Relic'],
                ['weaponKillsSword', 'Sword'],
                ['weaponKillsGrenadeLauncher', 'Grenade Launcher']
            ])
        ],
        [
            'Destination',
            new Map([
                ['publicEventsCompleted', 'Public Events Completed'],
                ['heroicPublicEventsCompleted', 'Heroic Public Events Completed'],
                ['adventuresCompleted', 'Adventures Completed']
            ])
        ]
    ]);

    static asIsOrder() {
        return 1;
    }

    static numberedKeyOrder(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
        const aStepId = parseInt(a.key, 10);
        const bStepId = parseInt(b.key, 10);
        return aStepId > bStepId ? 1 : (bStepId > aStepId ? -1 : 0);
    }
}