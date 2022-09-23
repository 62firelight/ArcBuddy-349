import { KeyValue } from "@angular/common";

export class Helper {
    static sections = new Map([
        ['General',
            new Map([
                ['secondsPlayed', 'Time Played'],
                ['kills', 'Kills'],
                ['assists', 'Assists'],
                ['deaths', 'Deaths'],
                ['killsDeathsRatio', "KD Ratio"],
                ['efficiency', 'Efficiency'],
                ['precisionKills', 'Precision Kills'],
                ['weaponKillsSuper', 'Super Kills'],
                ['weaponKillsGrenade', 'Grenade Kills'],
                ['weaponKillsMelee', 'Melee Kills'],
                ['activitiesCleared', 'Activites Cleared (PvE)'],
                ['activitiesEntered', 'Activites Entered']
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
        ],
        [
            'Other',
            new Map([
                ['resurrectionsPerformed', 'Revives'],
                ['resurrectionsReceived', 'Revives Received'],
                ['orbsDropped', 'Orbs of Power Generated'],
                ['orbsGathered', 'Orbs of Power Gathered']
            ])
        ]
    ]);

    static chartableSections = new Set([
        'Weapon Kills'
    ]);

    static primaryWeapons = [
        'Auto Rifle',
        'Pulse Rifle',
        'Scout Rifle',
        'Hand Cannon',
        'Submachine Gun',
        'Sidearm',
        'Bow'
    ];

    static specialWeapons = [
        'Glaive',
        'Fusion Rifle',
        'Trace Rifle',
        'Shotgun',
        'Sniper Rifle'
    ];

    static heavyWeapons = [
        'Machine Gun',
        'Rocket Launcher',
        'Sword',
        'Grenade Launcher'
    ];

    static asIsOrder() {
        return 1;
    }

    static numberedKeyOrder(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
        const aStepId = parseInt(a.key, 10);
        const bStepId = parseInt(b.key, 10);
        return aStepId > bStepId ? 1 : (bStepId > aStepId ? -1 : 0);
    }
}