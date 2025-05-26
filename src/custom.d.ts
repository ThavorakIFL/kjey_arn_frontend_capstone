import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

declare module "*.svg" {
    import React from "react";
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}

declare module "next" {
    export interface PageProps {
        params: Params;
    }
}
