import React, { useCallback, useEffect, useRef, useState } from 'react';
import Piano from '../../components/piano/piano';
import PianoItem from '../../components/piano/pianoItem';
import Alert from '../../components/alert/alert';
import { chords } from './piano_chords';
// 引入Tone.js
import * as Tone from 'tone';

import styles from './home.module.css';
const test = [
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

const v2i = test.flat(3).reduce((prev: Record<string, string>, cur) => {
    prev[cur.value] = cur.id;
    return prev;
}, {});

console.log('v2i', v2i);

const chord_music = Object.entries(chords).reduce((prev: Record<string, HTMLAudioElement>, curPair) => {
    prev[curPair[0]] = new Audio(curPair[1]);
    return prev;
}, {});

const speed = 5;

console.log(chord_music);
interface paramProps {
    id?: string;
    value?: string;
    checked?: boolean;
}

function Home() {
    const [keyState, setKey] = useState(test);
    const [downKeys, setDownKeys] = useState<string[]>([]);
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
                }
                if (itt.checked === true) {
                    console.log(itt);
                }
                return itt;
            });
        });
        setKey(temp);
    };

    const handleKeyDown = (value: string) => {
        setDownKeys([...new Set([...downKeys, value])]);
    };

    const handleKeyUp = (value: string) => {
        setDownKeys([...downKeys.filter((key) => key !== value)]);
    };

    const realTimeChords = useRef<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawChords = () => {
        const keyDoms = realTimeChords.current.map((value) => {
            const id = v2i[value];
            const curDom = document.getElementById(id);
            const rect = curDom?.getClientRects()[0];
            return rect;
        });

        if (canvasRef.current) {
            const ctx: CanvasRenderingContext2D = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
            let snapshot = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.putImageData(snapshot, 0, -speed);
            for (let dom of keyDoms) {
                if (dom) {
                    ctx.beginPath();
                    ctx.rect(dom?.left, dom.top - speed, dom?.width, 10);
                    ctx.fillStyle = 'pink';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }

        requestAnimationFrame(drawChords);
    };

    useEffect(() => {
        drawChords();
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
    }, []);

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
        realTimeChords.current = [...downKeys];
    }, [downKeys]);

    const playKey = (musicKey: string) => {
        if (musicKey) {
            let curMusicChord = test.flat(3).find((item) => item.id === musicKey)?.chord;
            if (curMusicChord) {
                // 新建一个音符然后播放它
                const synth = new Tone.Synth().toDestination();
                // 第一个参数是当前音符 例如 C4 D4 E4
                // 第二个参数是持续时间 前边的数字越大，持续时间越短
                synth.triggerAttackRelease(curMusicChord, '2n');
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
                setMouseDown(true);
                const curId = ((e.target as unknown) as { id: string }).id;
                if (!curId) return;
                playKey(curId);
                setDownKeys([test.flat(3).find((item) => item.id === curId)?.value ?? '']);
            }}
            onMouseUp={(e) => {
                setMouseDown(false);
                const curId = ((e.target as unknown) as { id: string }).id;
                if (!curId) return;
                setDownKeys([]);
            }}
            onMouseMove={(e) => {
                if (!mouseDown) return;
                const curId = ((e.target as unknown) as { id: string }).id;
                const curKeyValue = test.flat(3).find((item) => item.id === curId)?.value ?? '';
                if (downKeys[0] === curKeyValue) return;
                if (!curId) return;
                playKey(curId);
                setDownKeys([curKeyValue]);
            }}
        >
            <Piano
                onSelect={(e) => {
                    handleSelect(JSON.parse(e));
                }}
            >
                {Lists}
            </Piano>
            {}
            <canvas ref={canvasRef} style={{ backgroundColor: 'white', width: '100vw', height: '100vh' }}></canvas>
        </div>
    );
}

export default Home;
