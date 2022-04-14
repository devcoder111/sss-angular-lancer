export class Template {
    label       : string;
    template    : string;
    name        : string;
    leaf        : string;
    refine      : any[];
    visible     : boolean;
    hovermenu   : boolean;
    style       ?: { [rule: string] : string };
}