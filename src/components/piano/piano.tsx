import React, { FC } from 'react';
import styles from './piano.module.css';
import classNames from 'classnames';

export interface BasePianoProps {
    defaultIndex?: number;
    className?: string;
    onSelect?: (selected: string) => void;
    children?: React.ReactNode;
}

interface IPianoContext {
    onSelect?: (selected: string) => void;
}

export const Piano: FC<BasePianoProps> = (props) => {
    const { className, onSelect, children } = props;
    const classes = classNames(styles.piano, styles[className === undefined ? '' : className]);

    return <div className={classes}>{children}</div>;
};

export default Piano;
