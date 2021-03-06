import React, { FC, useState } from 'react';
import classNames from 'classnames';

import styles from './pianoItem.module.css';

type keyValue = { id: string; value: string; checked: boolean; chord: string }[];

export interface PianoItemProps {
    className?: string;
    keyValue: keyValue;
    children?: React.ReactNode;
}
export const PianoItem: FC<PianoItemProps> = (props) => {
    const { className, keyValue, children } = props;
    const [pianoKeys, setKey] = useState(keyValue);

    const classes = classNames(styles.pianoItem, styles[className === undefined ? '' : className]);

    const wkList = pianoKeys.map((item, index) => {
        if (index < 7) {
            return (
                <button id={item.id} key={item.id} className={`${styles.whiteKey} ${item.checked ? styles.wk : ''}`}>
                    {item.value}-{item.chord}
                    <audio></audio>
                </button>
            );
        }
    });
    const bkListOne = pianoKeys.map((item, index) => {
        if (index >= 7 && index < 9) {
            return (
                <button id={item.id} key={item.id} className={`${styles.blackKey} ${item.checked ? styles.bk : ''}`}>
                    {item.value}-{item.chord}
                    <audio></audio>
                </button>
            );
        }
    });
    const bkListTwo = pianoKeys.map((item, index) => {
        if (index >= 9) {
            return (
                <button id={item.id} key={item.id} className={`${styles.blackKey} ${item.checked ? styles.bk : ''}`}>
                    {item.value}-{item.chord}
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
