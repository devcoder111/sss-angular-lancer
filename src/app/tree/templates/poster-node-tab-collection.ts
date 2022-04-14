import { Template } from "../../models/template";

export const posterNodeTabCollection: Template[] = [

    {
        "label"     : "View",
        "template"  : "SSSIframeComponent",
        "name"      : "all",
        "leaf"      : "ALLRESOURCES",
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "Schedule?",
        "template"  : "SSSIframeComponent",
        "name"      : "schedule",
        "leaf"      : "ALLRESOURCES",
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "Add to Folder?",
        "template"  : "SSSIframeComponent",
        "name"      : "schedule",
        "leaf"      : "ALLRESOURCES",
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
        "label"     : "English",
        "template"  : "SSSIframeComponent",
        "name"      : "english",
        "leaf"      : "ALLRESOURCES",
        "refine"    : [],
        "visible"   : true,
        "hovermenu" : false
    },
    {
        "label"     : "Spanish",
        "template"  : "SSSIframeComponent",
        "name"      : "spanish",
        "leaf"      : "ALLRESOURCES",
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
        "label"     : "Edit",
        "template"  : "SSSEditComponent",
        "name"      : "edit",
        "leaf"      : "",
        "refine"    : [],
        "visible"   : true,
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
