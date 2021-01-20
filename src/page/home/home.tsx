import React, { useEffect, useState } from 'react';
import Piano from '../../components/piano/piano';
import PianoItem from '../../components/piano/pianoItem';
import Alert from '../../components/alert/alert';
// 导入音频的base64
import { chords } from './piano_chords';

import styles from './home.module.css';
// 给每个健绑定上chord属性，从c1开始
const test = [
    [
        { id: '1', value: '1', checked: false, chord: 'C1' },
        { id: '2', value: '2', checked: false, chord: 'D1' },
        { id: '3', value: '3', checked: false, chord: 'E1' },
        { id: '4', value: '4', checked: false, chord: 'F1' },
        { id: '5', value: '5', checked: false, chord: 'G1' },
        { id: '6', value: '6', checked: false, chord: 'A1' },
        { id: '7', value: '7', checked: false, chord: 'B1' },

        { id: '8', value: '8', checked: false, chord: 'Db1' },
        { id: '9', value: '9', checked: false, chord: 'Eb1' },

        { id: '10', value: '0', checked: false, chord: 'Gb1' },
        { id: '11', value: 'n', checked: false, chord: 'Ab1' },
        { id: '12', value: 'm', checked: false, chord: 'Bb1' },
    ],

    [
        { id: '13', value: 'q', checked: false, chord: '' },
        { id: '14', value: 'w', checked: false, chord: '' },
        { id: '15', value: 'e', checked: false, chord: '' },
        { id: '16', value: 'r', checked: false, chord: '' },
        { id: '17', value: 't', checked: false, chord: '' },
        { id: '18', value: 'y', checked: false, chord: '' },
        { id: '19', value: 'u', checked: false, chord: '' },

        { id: '21', value: 'i', checked: false, chord: '' },
        { id: '22', value: 'o', checked: false, chord: '' },

        { id: '23', value: 'p', checked: false, chord: '' },
        { id: '24', value: 'a', checked: false, chord: '' },
        { id: '25', value: 's', checked: false, chord: '' },
    ],

    [
        { id: '26', value: 'd', checked: false, chord: '' },
        { id: '27', value: 'f', checked: false, chord: '' },
        { id: '28', value: 'g', checked: false, chord: '' },
        { id: '29', value: 'h', checked: false, chord: '' },
        { id: '30', value: 'j', checked: false, chord: '' },
        { id: '31', value: 'k', checked: false, chord: '' },
        { id: '32', value: 'l', checked: false, chord: '' },

        { id: '33', value: 'z', checked: true, chord: '' },
        { id: '34', value: 'x', checked: false, chord: '' },

        { id: '35', value: 'c', checked: false, chord: '' },
        { id: '46', value: 'v', checked: false, chord: '' },
        { id: '37', value: 'b', checked: false, chord: '' },
    ],
];

// 把chord中所有的base64转换为Audio对象
const chord_music = Object.entries(chords).reduce((prev: Record<string, HTMLAudioElement>, curPair) => {
    prev[curPair[0]] = new Audio(curPair[1]);
    return prev;
}, {});

console.log(chord_music);
interface paramProps {
    id?: string;
    value?: string;
    checked?: boolean;
}

function Home() {
    const [keyState, setKey] = useState(test);
    // 新建一个数组 存储当前按下的所有按键
    const [downKeys, setDownKeys] = useState<string[]>([]);
    // 新建一个状态 存储鼠标是否按下
    const [mouseDown, setMouseDown] = useState<boolean>(false);
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

    const playKey = (musicKey: string) => {
        if (musicKey) {
            let curMusicChord = test.flat(3).find((item) => item.id === musicKey)?.chord;
            // 如果chord找到了
            if (curMusicChord) {
                // 将audio的进度重置为0
                chord_music[curMusicChord].currentTime = 0;
                chord_music[curMusicChord].play();
                console.log();
            }
        }
    };

    return (
        <div
            className={styles.container}
            tabIndex={-1}
            onKeyDown={(e) => {
                handleKeyDown(e.key);
                playKey(e.key);
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
                // 如果当前元素没有id，就啥也不干
                if (!curId) return;
                // 找到test数组中指定id的value，当然首先要用flat方法把数组打平，让它只有一个层级
                // 把downKeys数组设置为只有当前鼠标按下的
                playKey(curId);
                setDownKeys([test.flat(3).find((item) => item.id === curId)?.value ?? '']);
            }}
            onMouseUp={(e) => {
                // 更新鼠标状态为抬起
                setMouseDown(false);
                const curId = ((e.target as unknown) as { id: string }).id;
                // 如果当前元素没有id，就啥也不干
                if (!curId) return;
                // 找到test数组中指定id的value，当然首先要用flat方法把数组打平，让它只有一个层级
                // 把downKeys数组设置为只有当前鼠标按下的
                setDownKeys([]);
            }}
            onMouseMove={(e) => {
                // 如果鼠标没按下的话 return出去啥也不做
                if (!mouseDown) return;
                const curId = ((e.target as unknown) as { id: string }).id;
                // 如果当前元素没有id，就啥也不干
                if (!curId) return;
                playKey(curId);
                // 找到test数组中指定id的value，当然首先要用flat方法把数组打平，让它只有一个层级
                // 把downKeys数组设置为只有当前鼠标按下的
                setDownKeys([test.flat(3).find((item) => item.id === curId)?.value ?? '']);
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
