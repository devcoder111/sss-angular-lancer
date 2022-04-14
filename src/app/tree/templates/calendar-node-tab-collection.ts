import { Template } from 'src/app/models/template';

export const calendarNodeTabCollection: Template[] = [

    {
        "label"     : null,
        "template"  : "SSSCardComponent",
        "name"      : "day",
        "leaf"      : null,
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "Time Line",
        "template"  : "SSSTimelineComponent",
        "name"      : "timeline",
        "leaf"      : "timeline",
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "State Standards",
        "template"  : "SSSTableComponent",
        "name"      : "statestandards",
        "leaf"      : "statestandards",
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "Participation",
        "template"  : "SSSTableComponent",
        "name"      : "participation",
        "leaf"      : "subscibers",
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "Subscribers",
        "template"  : "SSSTableComponent",
        "name"      : "subscibers",
        "leaf"      : "subscibers",
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "Month",
        "template"  : "SSSCardComponent",
        "name"      : "month",
        "leaf"      : null,
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "Edit",
        "template"  : "SSSEditComponent",
        "name"      : "edit",
        "leaf"      : null,
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "",
        "template"  : "SSSEggShellComponent",
        "name"      : "vacant",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "",
        "template"  : "SSSTextAreaComponent",
        "name"      : "stub",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "Tags",
        "template"  : "SSSGridComponent",
        "name"      : "tags",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "Menu",
        "template"  : "SSSMenuComponent",
        "name"      : "menu",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "Basic",
        "template"  : "SSSBasicComponent",
        "name"      : "basic",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : true
    },
    {
        "label"     : "Coin",
        "template"  : "SSSCoinComponent",
        "name"      : "coin",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "Headline",
        "template"  : "SSSLinkComponent",
        "name"      : "headline",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "Marquee",
        "template"  : "SSSLinkComponent",
        "name"      : "marquee",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "SSS Button",
        "template"  : "SSSButtonComponent",
        "name"      : "button",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "Destinations",
        "template"  : "SSSRelayComponent",
        "name"      : "destinations",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "Modal",
        "template"  : "SSSModalComponent",
        "name"      : "modal",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    },
    {
        "label"     : "Calendar",
        "template"  : "SSSCalendarComponent",
        "name"      : "calendar",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : false,
        "hovermenu" : false
    }
];
