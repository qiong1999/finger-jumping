import React, { FC, createContext } from 'react';
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
export const PianoContext = createContext<IPianoContext>({});

export const Piano: FC<BasePianoProps> = (props) => {
    const { className, onSelect, children } = props;
    const classes = classNames(styles.piano, styles[className === undefined ? '' : className]);
    const handleClick = (index: string) => {
        if (onSelect) {
            onSelect(index);
        }
    };
    const passedContext: IPianoContext = {
        onSelect: handleClick,
    };
    return (
        <div className={classes}>
            <PianoContext.Provider value={passedContext}>{children}</PianoContext.Provider>
        </div>
    );
};

export default Piano;
