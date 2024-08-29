export interface Welcome {
    forEach(arg0: (character: Item) => void): unknown;
    items: Item[];
}

export interface Item {
    id: number;
    postByUser: number;
    title: string;
    body: string;
    creationDate: string;
    estimatedPublicationDate: string;
    status: string;
    approvalPercentage: number;
    corrections: string,
    platform: string;
    postUrl: string,
    multimediaUrl: string,
    deletedAt: null;
}
