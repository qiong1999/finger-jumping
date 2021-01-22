import React, { FC, useRef, useEffect, useState } from 'react';
import styles from './alert.module.css';
import classNames from 'classnames';

interface BaseAlertProps {
    className?: string;
    children?: React.ReactNode;
    ownStyle?: React.CSSProperties;
    handleClick?: Function;
    submit?: Function;
    message?: { chords: string[] };
}

export const Alert: FC<BaseAlertProps> = (props) => {
    const { className, children, ownStyle, handleClick, submit, message } = props;
    const classes = classNames(styles.alt, styles[className === undefined ? '' : className]);
    const chordSelect = useRef<HTMLSelectElement>(null);
    const valueSelect = useRef<HTMLInputElement>(null);
    const chord = useRef<string>('');
    const value = useRef<string>('');
    const optionLists = message?.chords.map((item) => {
        return (
            <option value={item} key={item}>
                {item}
            </option>
        );
    });
    const handleSelect = () => {
        console.log('执行了');
        if (chordSelect.current && valueSelect.current) {
            const selectedIndex = chordSelect.current.selectedIndex;
            chord.current = chordSelect.current.options[selectedIndex].value;

            value.current = valueSelect.current.value;
        }
    };
    useEffect(() => {
        handleSelect();
    }, []);
    return (
        <div className={styles.container} style={ownStyle}>
            <div className={styles.subMenu}></div>
            <div className={classes}>
                <div
                    className={styles.close}
                    onClick={() => {
                        handleClick?.('none');
                    }}
                ></div>
                <div>自定义琴键</div>
                <div>绑定按键</div>
                <input ref={valueSelect} className={styles.inp} placeholder="输入选择键盘键" />

                <div>设定琴音</div>
                <select ref={chordSelect} className={styles.select}>
                    {optionLists}
                </select>

                <button
                    className={styles.btn}
                    onClick={() => {
                        handleSelect();
                        submit?.({ chord: chord.current, value: value.current });
                    }}
                >
                    提交
                </button>
            </div>
        </div>
    );
};

export default Alert;
