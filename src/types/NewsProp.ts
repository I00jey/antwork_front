export interface NewsProp {
    _id: string;
    url: string;
    title: string;
    subtitle?: string | undefined;
    smallimg: string;
    bigimg?: string | undefined;
    content: string;
    date: string;
    group: number;
}
