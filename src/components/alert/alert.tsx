import React, { FC } from 'react';
import styles from './alert.module.css';
import classNames from 'classnames';

interface BaseAlertProps {
    className?: string;
    children?: React.ReactNode;
}

export const Alert: FC<BaseAlertProps> = (props) => {
    const { className, children } = props;
    const classes = classNames(styles.alt, styles[className === undefined ? '' : className]);
    return (
        <div className={classes}>
            <div>自定义琴键</div>
            <div>绑定按键</div>
            <input className={styles.inp} placeholder="点击后按下你想搞定的按键" />
            <div>设定琴音</div>
            <input className={styles.inp} placeholder="点击下拉框选择" />
            <button
                className={styles.btn}
                onClick={() => {
                    console.log(1);
                }}
            >
                提交
            </button>
        </div>
    );
};

export default Alert;
