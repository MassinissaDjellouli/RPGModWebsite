export interface IModVersions {
    version: string;
    minecraftVersion: string;
    forgeVersion: string;
    uploadDate: Date;
    downloadCount: number;
}


export type INewModVersion = {
    version: string,
    minecraftVersion: string,
    forgeVersion: string,
    uploadDate: Date,
    downloadCount: number,
    file: number[]
}