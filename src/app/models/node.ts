export class Node {
    id              ?: string;
    parent          ?: string;
    text            ?: string;

    auxtabs         ?: any[]
    background      ?: string;
    color           ?: string;
    custom          ?: string;
    heightstate     ?: string;
    instantiations  ?: any;
    leaves          ?: any;
    name            ?: string;
    subscribers     ?: any[]
    tags            ?: any
    type            ?: string;
    url             ?: string
	_id             ?: string

	constructor(_id: string, color: string, name: string, type: string) {

		const img = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Blank_Calendar_page_icon.svg/220px-Blank_Calendar_page_icon.svg.png"
		const background = type == "stub" ? img : "";

		this._id             = _id;
		this.color           = color;
		this.name            = name;
		this.auxtabs         = [];
		this.type            = type;
		this.tags            = {};
		this.background      = background;
		this.url             = "";
	}
}
