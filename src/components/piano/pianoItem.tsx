import React, { FC, useContext, useState } from 'react';
import classNames from 'classnames';
import { PianoContext } from './piano';

import styles from './pianoItem.module.css';

type keyValue = { id: string; value: string; checked: boolean }[];
export interface PianoItemProps {
    className?: string;
    keyValue: keyValue;
    children?: React.ReactNode;
}
export const PianoItem: FC<PianoItemProps> = (props) => {
    const { className, keyValue, children } = props;
    const classes = classNames(styles.pianoItem, styles[className === undefined ? '' : className]);
    const context = useContext(PianoContext);
    const handleClick = (index: string) => {
        if (context.onSelect) {
            context.onSelect(index);
        }
    };
    const wkList = keyValue.map((item, index) => {
        if (index < 7) {
            return (
                <button
                    id={item.id}
                    key={item.id}
                    className={`${styles.whiteKey} ${item.checked ? styles.wk : ''}`}
                    onClick={() => handleClick(JSON.stringify(item))}
                >
                    {item.value}
                    <audio></audio>
                </button>
            );
        }
    });
    const bkListOne = keyValue.map((item, index) => {
        if (index >= 7 && index < 9) {
            return (
                <button
                    id={item.id}
                    key={item.id}
                    className={`${styles.blackKey} ${item.checked ? styles.bk : ''}`}
                    onClick={() => handleClick(JSON.stringify(item))}
                >
                    {item.value}
                    <audio></audio>
                </button>
            );
        }
    });
    const bkListTwo = keyValue.map((item, index) => {
        if (index >= 9) {
            return (
                <button
                    id={item.id}
                    key={item.id}
                    className={`${styles.blackKey} ${item.checked ? styles.bk : ''}`}
                    onClick={() => handleClick(JSON.stringify(item))}
                >
                    {item.value}
                    <audio></audio>
                </button>
            );
        }
    });

    return (
        <div className={classes}>
            <div>{wkList}</div>
            <div className={styles.bkSet}>
                <div>{bkListOne}</div>
                <div>{bkListTwo}</div>
            </div>
        </div>
    );
};

export default PianoItem;
