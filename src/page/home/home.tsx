import React, { useState, useEffect } from 'react';
import Piano from '../../components/piano/piano';
import PianoItem from '../../components/piano/pianoItem';
import Alert from '../../components/alert/alert';
import { chords } from '../../piano_chords';

import styles from './home.module.css';
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
        { id: '13', value: 'q', checked: false, chord: 'E1' },
        { id: '14', value: 'w', checked: false, chord: 'E1' },
        { id: '15', value: 'e', checked: false, chord: 'E1' },
        { id: '16', value: 'r', checked: false, chord: 'E1' },
        { id: '17', value: 't', checked: false, chord: 'E1' },
        { id: '18', value: 'y', checked: false, chord: 'E1' },
        { id: '19', value: 'u', checked: false, chord: 'E1' },

        { id: '21', value: 'i', checked: false, chord: 'E1' },
        { id: '22', value: 'o', checked: false, chord: 'E1' },

        { id: '23', value: 'p', checked: false, chord: 'E1' },
        { id: '24', value: 'a', checked: false, chord: 'E1' },
        { id: '25', value: 's', checked: false, chord: 'E1' },
    ],

    [
        { id: '26', value: 'd', checked: false, chord: 'E1' },
        { id: '27', value: 'f', checked: false, chord: 'E1' },
        { id: '28', value: 'g', checked: false, chord: 'E1' },
        { id: '29', value: 'h', checked: false, chord: 'E1' },
        { id: '30', value: 'j', checked: false, chord: 'E1' },
        { id: '31', value: 'k', checked: false, chord: 'E1' },
        { id: '32', value: 'l', checked: false, chord: 'E1' },

        { id: '33', value: 'z', checked: true, chord: 'E1' },
        { id: '34', value: 'x', checked: false, chord: 'E1' },

        { id: '35', value: 'c', checked: false, chord: 'E1' },
        { id: '46', value: 'v', checked: false, chord: 'E1' },
        { id: '37', value: 'b', checked: false, chord: 'E1' },
    ],
];
//把chord 中所有的base64转换为Audio 对象
const chord_music = Object.entries(chords).reduce((prev: Record<string, HTMLAudioElement>, curPair) => {
    prev[curPair[0]] = new Audio(curPair[1]);
    return prev;
}, {});

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

    const playKey = (musicKey: string) => {
        if (musicKey) {
            let curMusicChord = test.flat(3).find((item) => item.id === musicKey || item.value === musicKey)?.chord;
            //如果chord找到了
            if (curMusicChord) {
                //将audio的进度重置为
                chord_music[curMusicChord].currentTime = 0;
                chord_music[curMusicChord].play();
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
                console.log('mouseDown', curId);
                // 如果当前元素没有id，就啥也不干
                if (!curId) return;
                // 找到test数组中指定id的value，当然首先要用flat方法把数组打平，让它只有一个层级
                // 把downKeys数组设置为只有当前鼠标按下的
                playKey(curId);
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
                playKey(curId);
                setDownKeys([test.flat(3).find((item) => item.id === curId)?.value ?? '']);
            }}
        >
            <Piano>{Lists}</Piano>
        </div>
    );
}

export default Home;
