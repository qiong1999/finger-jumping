import React, { useState, useEffect } from 'react';
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
    //存储钢琴信息
    const [keyState, setKey] = useState(test);
    //存储鼠标是否按下
    const [downKeys, setDownKeys] = useState<string[]>([]);
    //存储鼠标当前在哪个key上，由于鼠标一次只能有一个key，所以只需存一次
    const [mouseDown, setMouseDown] = useState<boolean>(false);
    const Lists = keyState.map((item, index) => {
        return <PianoItem keyValue={item} key={index}></PianoItem>;
    });

    //当按下一个key的时候，就把它加入到当前正处于按下状态的key数组
    const handleKeyDown = (value: string) => {
        setDownKeys([...new Set([...downKeys, value])]);
    };
    //当抬起一个key的时候，就把它移出数组
    const handleKeyUp = (value: string) => {
        setDownKeys([...downKeys.filter((key) => key !== value)]);
    };
    useEffect(() => {
        let temp = keyState.map((item) => {
            return item.map((itt) => {
                itt.checked = false;
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
            onMouseDown={(e) => {
                // 更新鼠标状态为按下
                setMouseDown(true);

                // 把当前按下的按键加入到数组中
                // 通过e.target可以获取到当前鼠标在哪个键上
                // ts不让获取target上的id，但其实上边有id，所以需要进行一下类型转换，先
                // 转换为unknown 在转化为{id: string}，就可以拿到id了

                const curId = ((e.target as unknown) as { id: string }).id;
                console.log('mouseDown', curId);
                // 如果当前元素没有id，就啥也不干
                if (!curId) return;
                // 找到test数组中指定id的value，当然首先要用flat方法把数组打平，让它只有一个层级
                // 把downKeys数组设置为只有当前鼠标按下的
                setDownKeys([test.flat(3).find((item) => item.id === curId)?.value ?? '']);
            }}
            onMouseUp={(e) => {
                //更新鼠标状态为抬起
                setMouseDown(false);
                const curId = ((e.target as unknown) as { id: string }).id;
                console.log('mouseUp', curId);
                if (!curId) return;
                // 找到test数组中指定id的value，当然首先要用flat方法把数组打平，让它只有一个层级
                // 把downKeys数组设置为只有当前鼠标按下的
                setDownKeys([]);
            }}
            onMouseMove={(e) => {
                //如果鼠标没有按下的话,什么都不做
                if (!mouseDown) return;
                const curId = ((e.target as unknown) as { id: string }).id;

                if (!curId) return;
                setDownKeys([test.flat(3).find((item) => item.id === curId)?.value ?? '']);
            }}
        >
            <Piano>{Lists}</Piano>
        </div>
    );
}

export default Home;
