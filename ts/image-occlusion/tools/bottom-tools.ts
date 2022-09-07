import {
    mdiCopy,
    mdiDeleteOutline,
    mdiGroup,
    mdiZoomIn,
    mdiZoomOut,
    mdiZoomReset,
} from "../icons";
import {
    deleteItem,
    groupShapes,
    duplicateItem,
    zoomIn,
    zoomOut,
    zoomReset,
} from "./lib";

export const cursorTools = [
    {
        id: 1,
        icon: mdiDeleteOutline,
        action: deleteItem,
    },
    {
        id: 2,
        icon: mdiGroup,
        action: groupShapes,
    },
    {
        id: 3,
        icon: mdiCopy,
        action: duplicateItem,
    },
];

export const zoomTools = [
    {
        id: 1,
        icon: mdiZoomOut,
        action: zoomOut,
    },
    {
        id: 2,
        icon: mdiZoomReset,
        action: zoomReset,
    },
    {
        id: 3,
        icon: mdiZoomIn,
        action: zoomIn,
    },
];
