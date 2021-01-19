import React, { useEffect, useState } from 'react';
import Piano from '../../components/piano/piano';
import PianoItem from '../../components/piano/pianoItem';
import Alert from '../../components/alert/alert';

import styles from './home.module.css';
const test = [
    [
        { id: '1', value: '1', checked: false },
        { id: '2', value: '2', checked: false },
        { id: '3', value: '3', checked: false },
        { id: '4', value: '4', checked: false },
        { id: '5', value: '5', checked: false },
        { id: '6', value: '6', checked: false },
        { id: '7', value: '7', checked: false },

        { id: '8', value: '8', checked: false },
        { id: '9', value: '9', checked: false },

        { id: '10', value: '0', checked: false },
        { id: '11', value: 'n', checked: false },
        { id: '12', value: 'm', checked: false },
    ],

    [
        { id: '13', value: 'q', checked: false },
        { id: '14', value: 'w', checked: false },
        { id: '15', value: 'e', checked: false },
        { id: '16', value: 'r', checked: false },
        { id: '17', value: 't', checked: false },
        { id: '18', value: 'y', checked: false },
        { id: '19', value: 'u', checked: false },

        { id: '21', value: 'i', checked: false },
        { id: '22', value: 'o', checked: false },

        { id: '23', value: 'p', checked: false },
        { id: '24', value: 'a', checked: false },
        { id: '25', value: 's', checked: false },
    ],

    [
        { id: '26', value: 'd', checked: false },
        { id: '27', value: 'f', checked: false },
        { id: '28', value: 'g', checked: false },
        { id: '29', value: 'h', checked: false },
        { id: '30', value: 'j', checked: false },
        { id: '31', value: 'k', checked: false },
        { id: '32', value: 'l', checked: false },

        { id: '33', value: 'z', checked: true },
        { id: '34', value: 'x', checked: false },

        { id: '35', value: 'c', checked: false },
        { id: '46', value: 'v', checked: false },
        { id: '37', value: 'b', checked: false },
    ],
];
interface paramProps {
    id?: string;
    value?: string;
    checked?: boolean;
}

function Home() {
    const [keyState, setKey] = useState(test);
    // 新建一个数组 存储当前按下的所有按键
    const [downKeys, setDownKeys] = useState<string[]>([]);
    const Lists = keyState.map((item, index) => {
        return <PianoItem keyValue={item} key={index}></PianoItem>;
    });
    const handleSelect = (param: paramProps) => {
        let temp = keyState.map((item) => {
            return item.map((itt) => {
                itt.checked = false;
                if (itt.value === param.value) {
                    itt.checked = true;
                    //1console.log('itt', itt);
                }
                if (itt.checked === true) {
                    console.log(itt);
                }
                return itt;
            });
        });
        setKey(temp);
    };

    // 当按下一个key的时候，就把它加入到当前正处于按下状态的key数组
    const handleKeyDown = (value: string) => {
        setDownKeys([...new Set([...downKeys, value])]);
    };

    // 当抬起一个key的时候，就把它移出数组
    const handleKeyUp = (value: string) => {
        setDownKeys([...downKeys.filter((key) => key !== value)]);
    };

    // 监听downKeys数组，当数组发生变化（数组发生变化说明按键变化）的时候更新界面
    useEffect(() => {
        // 这里可以借用你写好的逻辑
        let temp = keyState.map((item) => {
            return item.map((itt) => {
                itt.checked = false;
                // 如果按下按键的数组中有当前遍历到的item的value
                if (downKeys.includes(itt.value)) {
                    itt.checked = true;
                }
                return itt;
            });
        });
        setKey(temp);
    }, [downKeys]);

    return (
        <div
            className={styles.container}
            tabIndex={-1}
            onKeyDown={(e) => {
                handleKeyDown(e.key);
            }}
            onKeyUp={(e) => {
                handleKeyUp(e.key);
            }}
        >
            <Piano
                onSelect={(e) => {
                    handleSelect(JSON.parse(e));
                }}
            >
                {Lists}
            </Piano>
            <Alert></Alert>
        </div>
    );
}

export default Home;
