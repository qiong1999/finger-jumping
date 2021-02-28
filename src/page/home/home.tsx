import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import Piano from '../../components/piano/piano';
import PianoItem from '../../components/piano/pianoItem';
import Alert from '../../components/alert/alert';
import { chords } from '../../piano_chords';

import styles from './home.module.css';

const test = [
    [
        { id: '1113', value: 'A', checked: false, chord: 'C2' },
        { id: '1114', value: 'B', checked: false, chord: 'D2' },
        { id: '1115', value: 'C', checked: false, chord: 'E2' },
        { id: '1116', value: 'D', checked: false, chord: 'F2' },
        { id: '1117', value: 'E', checked: false, chord: 'G2' },
        { id: '1118', value: 'F', checked: false, chord: 'A2' },
        { id: '1119', value: 'G', checked: false, chord: 'B2' },
        { id: '2111', value: 'H', checked: false, chord: 'Db1' },
        { id: '2112', value: 'I', checked: false, chord: 'Eb2' },

        { id: '2113', value: 'O', checked: false, chord: 'Gb2' },
        { id: '2114', value: 'U', checked: false, chord: 'Ab2' },
        { id: '2115', value: 'F', checked: false, chord: 'Bb2' },
    ],
    [
        { id: '13', value: 'q', checked: false, chord: 'C3' },
        { id: '14', value: 'w', checked: false, chord: 'D3' },
        { id: '15', value: 'e', checked: false, chord: 'E3' },
        { id: '16', value: 'r', checked: false, chord: 'F3' },
        { id: '17', value: 't', checked: false, chord: 'G3' },
        { id: '18', value: 'y', checked: false, chord: 'A3' },
        { id: '19', value: 'u', checked: false, chord: 'B3' },
        { id: '21', value: 'i', checked: false, chord: 'Db3' },
        { id: '22', value: 'o', checked: false, chord: 'Eb3' },

        { id: '23', value: 'p', checked: false, chord: 'Gb2' },
        { id: '24', value: 'a', checked: false, chord: 'Ab3' },
        { id: '25', value: 's', checked: false, chord: 'Bb3' },
    ],
    [
        { id: '1', value: '1', checked: false, chord: 'C4' },
        { id: '2', value: '2', checked: false, chord: 'D4' },
        { id: '3', value: '3', checked: false, chord: 'E4' },
        { id: '4', value: '4', checked: false, chord: 'F4' },
        { id: '5', value: '5', checked: false, chord: 'G4' },
        { id: '6', value: '6', checked: false, chord: 'A4' },
        { id: '7', value: '7', checked: false, chord: 'B4' },

        { id: '8', value: '8', checked: false, chord: 'Db4' },
        { id: '9', value: '9', checked: false, chord: 'Eb4' },

        { id: '10', value: '0', checked: false, chord: 'Gb4' },
        { id: '11', value: 'n', checked: false, chord: 'Ab4' },
        { id: '12', value: 'm', checked: false, chord: 'Bb4' },
    ],
    [
        { id: '111', value: '@', checked: false, chord: 'C5' },
        { id: '112', value: '#', checked: false, chord: 'D5' },
        { id: '113', value: '$', checked: false, chord: 'E5' },
        { id: '114', value: '%', checked: false, chord: 'F5' },
        { id: '115', value: '^', checked: false, chord: 'G5' },
        { id: '116', value: '&', checked: false, chord: 'A5' },
        { id: '117', value: '*', checked: false, chord: 'B5' },

        { id: '118', value: '(', checked: false, chord: 'Db5' },
        { id: '119', value: ')', checked: false, chord: 'Eb5' },

        { id: '1110', value: '_', checked: false, chord: 'Gb5' },
        { id: '1111', value: '+', checked: false, chord: 'Ab5' },
        { id: '1112', value: '?', checked: false, chord: 'Bb5' },
    ],
];
//建立一个value到id 的map
const vtoi = test.flat(3).reduce((acc: Record<string, string>, cur) => {
    acc[cur.value] = cur.id;
    return acc;
}, {});
//console.log(vtoi);

//声明画布移动的速度
const speed = 3;
function Home() {
    //存储钢琴信息
    const [keyState, setKey] = useState(test);

    //存储鼠标是否按下
    const [downKeys, setDownKeys] = useState<string[]>([]);
    //存储鼠标当前在哪个key上，由于鼠标一次只能有一个key，所以只需存一次
    const [mouseDown, setMouseDown] = useState<boolean>(false);
    const [altTop, setTop] = useState(0);
    const [altLeft, setLeft] = useState(0);
    const [display, setDisplay] = useState('none');
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
    const realTimeChords = useRef<string[]>([]);
    //创建ref 用于绑定canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawChords = () => {
        //把当前正处于按下状态的按键数组转换为案件对应的dom的clientRect的数组
        //console.log(realTimeChords, 'realTimeChords');
        const keyDoms = realTimeChords.current.map((value) => {
            const id = vtoi[value];
            const curDom = document.getElementById(id);
            const rect = curDom?.getClientRects()[0];
            //  console.log(rect);
            return rect;
        });
        //console.log('执行了，', keyDoms);
        if (canvasRef.current) {
            const ctx: CanvasRenderingContext2D = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;

            //把画过的内容向上移动{speed}px;
            //先将当前画布图像存起来
            let snapshot = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);
            //清空当前画布
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            //再把存起来的画像放回画布，再向上移动{speed}

            const img = new Image();
            img.onload = function () {
                for (let dom of keyDoms) {
                    if (dom) {
                        ctx.beginPath();
                        ctx.rect(dom?.left, dom.top - speed, dom?.width, 70);
                        ctx.fillStyle = 'transparent';
                        ctx.fill();
                        ctx.closePath();
                        ctx.drawImage(img, dom?.left, dom.top + 20, 21, 50);
                    }
                }
            };
            img.src = 'ic.png';
            ctx.putImageData(snapshot, 10 * Math.random(), -speed);
        }

        requestAnimationFrame(drawChords);
    };
    const playKey = (musicKey: string) => {
        if (musicKey) {
            let curMusicChord = test.flat(3).find((item) => item.value === musicKey)?.chord;
            //如果chord找到了
            if (curMusicChord) {
                //将audio的进度重置为
                const synth = new Tone.Synth().toDestination();
                const now = Tone.now();
                synth.triggerAttackRelease(curMusicChord, '10n', now);
            }
        }
    };
    const changeKey = (e: { chord: string; value: string }) => {
        let tempKeys = keyState.map((item) => {
            item.map((itt) => {
                if (itt.value === e.value) {
                    itt.chord = e.chord;
                    console.log(itt);
                }
                return itt;
            });
            return item;
        });
        setKey(tempKeys);
    };
    const hasKey = (key: string) => {
        let temp = downKeys;
        let flag = false;
        for (let i = 0; i < temp.length; i++) {
            if (temp[i] === key) {
                flag = true;
            }
        }
        return flag;
    };
    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
        window.addEventListener('resize', () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        });
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const clickX = e.clientX;
            const clickY = e.clientY;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const rootW = 228;
            const rootH = 159;
            const right = screenW - clickX > rootW;
            const bottom = screenH - clickY > rootH;
            if (right) {
                setLeft(clickX);
            } else {
                setLeft(clickX - rootW);
            }
            if (bottom) {
                setTop(clickY);
            } else {
                setTop(clickY - rootH);
            }
            setDisplay('block');
        });
    }, []);
    useEffect(() => {
        // drawChords();
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
        realTimeChords.current = [...downKeys];
    }, [downKeys]);

    return (
        <div
            className={styles.container}
            onKeyDown={(e) => {
                if (hasKey(e.key)) return;
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
                let key = [test.flat(3).find((item) => item.id === curId)?.value ?? ''];
                drawChords();
                playKey(key[0]);
                setDownKeys(key);
            }}
            onMouseUp={(e) => {
                //更新鼠标状态为抬起
                setMouseDown(false);

                setDownKeys([]);
            }}
            onMouseMove={(e) => {
                //如果鼠标没有按下的话,什么都不做
                if (!mouseDown) return;

                const curId = ((e.target as unknown) as { id: string }).id;

                if (!curId) return;
                let key = [test.flat(3).find((item) => item.id === curId)?.value ?? ''];
                if (hasKey(key[0])) return;
                playKey(key[0]);
                setDownKeys(key);
            }}
        >
            <Alert
                className="alert"
                ownStyle={{ position: 'absolute', display: display, left: altLeft, top: altTop }}
                handleClick={(e: string) => {
                    setDisplay(e);
                }}
                submit={(e: { chord: string; value: string }) => {
                    console.log(e);
                    changeKey(e);
                }}
                message={{ chords: ['C1', 'A1'] }}
            ></Alert>
            <div
                className={styles.footer}
                onClick={() => {
                    setDisplay('none');
                }}
            >
                <Piano>{Lists}</Piano>
            </div>

            <canvas
                ref={canvasRef}
                style={{ backgroundColor: 'white', width: '100%', height: '100%' }}
                onClick={() => {
                    setDisplay('none');
                }}
            ></canvas>
        </div>
    );
}

export default Home;
