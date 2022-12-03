import {ObjectId} from 'mongodb';

export interface IUserStats {
    id: ObjectId | undefined;
    username: string;
    worldId: string;
    blocksMined: number;
    mobsKilled: number;
    blocksForaged: number;
    currentClass: string;
    miningLevel: number;
    miningXp: number;
    totalMiningXp: number;
    foragingLevel: number;
    foragingXp: number;
    totalForagingXp: number;
    combatLevel: number;
    combatXp: number;
    totalCombatXp: number;
    bestClass: string;
    highestLevel: number;
    totalXp: number;
}