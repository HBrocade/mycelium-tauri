import { ReactNode } from "react";

export interface barTitle {
    title?: string;
    icon?: ReactNode;
    leftContent?: ReactNode;
    rightContent?: ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

