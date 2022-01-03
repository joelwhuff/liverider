import './style.css';
import Game from './game/Game.js';

/** @type {HTMLCanvasElement} */
let canvas = document.querySelector('[data-play=openrider]');

window.addEventListener('resize', e => setCanvasSize());
setCanvasSize();

/**
 * Sets the canvas dimensions to those of its parent
 * Also reloads the context properties (mainly for fonts)
 */
function setCanvasSize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    setContextProperties(canvas.getContext('2d'));
}

/**
 * Sets the default drawing properties for the game
 * @param {CanvasRenderingContext2D} ctx
 */
function setContextProperties(ctx) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.font = 'bold 15px Ubuntu';
}

/**
 * @param {{}} opt
 */
function newGame(opt) {
    let game = new Game(canvas, opt);
    game.run();
    game.stateManager.push('parser');
}

let game = {
    ride: newGame,
};

let sampleTrack =
    'm v k 1e,i 1a j 11,n 1a o 12,2f 42 39 4b 3q 4f 4e 4h 4q 4h 5a 4f 5r 4b 69 46 6m 3v 73 3l 7e 3a 7o 2s 82 28 89 1k 8d v,91 3 9c -f 9m -13 9t -1o a1 -2d a2 -31 a1 -3i 9u -44 9p -4k 9i -53,2f -5i 2f -4u,6h -98 5v -96,-6h 27 -6h 1t,-73 4f -7f 45,-63 -be -6d -b9 -6o -b0 -6u -al -71 -a8 -72 -9q -72 -9b,-43 -96 -43 -9p -44 -a5 -47 -ah -4c -ar -4k -b4 -4t -bb -57 -bf -5f -bg -5n -bg -63 -be,-32 -61 -3d -6j -3m -75 -3t -7q -41 -8f -43 -96,-1n -4p -28 -55 -2l -5h -32 -61,-5a -4c -4m -4c,-9g -d3 -8n -db -82 -dl,-cn -cr -br -cq -bh -cq -b1 -cr -a8 -cu -9g -d3,-83 -ea -83 -e8,-e8 -d2 -dh -cu -cn -cr,-bj -a -bt -11 -c3 -1j -c7 -28 -c9 -2t -c9 -3k -ca -46 -cd -4o -ci -58 -cp -5o -d2 -67 -dd -6k,-f3 -7h -fp -7h -gd -7g -h2 -7d -hk -78 -i6 -70 -io -6l -j6 -68 -ji -5n -jo -59 -ju -4l -k1 -40 -k2 -3e -k2 9,-k2 16 -k2 11 -k2 u -k2 r -k2 p -k2 m -k2 k -k2 i -k2 g -k2 e -k2 c -k2 9,-k2 16 -k2 34 -k2 36 -k2 38,-d6 2k -d2 36,-ef g -et 6,-dc -9t -ie -9t,-iq -9t -in -9t -ii -9t -ie -9t,-l9 -9t -l6 -9t -l3 -9t -kv -9t -kr -9t -kp -9t -kl -9t -kg -9t -ke -9t -kc -9t -ka -9t -k7 -9t -k3 -9t -jv -9t -jt -9t -jr -9t -jn -9t -jl -9t -ji -9t -jd -9t -jb -9t -j9 -9t -j5 -9t -j1 -9t -iv -9t -is -9t -iq -9t,-l9 -9t -nl -9t,-p1 -9t -ot -9t -oq -9t -oo -9t -ok -9t -og -9t -ob -9t -o9 -9t -o5 -9t -o2 -9t -o0 -9t -nt -9t -nl -9t,-qo -9t -qk -9t -qg -9t -qb -9t -q5 -9t -q3 -9t -pu -9t -pq -9t -pj -9t -pc -9t -p8 -9t -p1 -9t,-r6 -bi -qi -bi,-i4 3r -i1 3j,-jm -ec -hq -ec,-oc -ec -kk -ec,-if -hv -if -ii,-ne -ic -o1 -i5,-md -l2 -ml -ld,-s1 -ko -sb -ke -sk -k2 -ss -jj -t2 -j2 -t6 -ig -t8 -hs -t8 -fi,-te -ct -sq -d3,-11n -e3 -12b -e1 -12r -dt -139 -do -13l -di -140 -da -14b -d0 -14k -ck -14s -c6 -152 -bn,-13n -an -13b -am,-14b -af -14b -ac,-146 -a6 -13s -a6,-14q -b0 -155 -b0,#-v8 -8e -vn -89 -vn -85,-12m -8e -11o -8e -11o -89 -12l -89,-11e -8e -10g -8e,-11v -89 -11o -85,-10v -85 -10v -8d,-106 -8e -vn -89,-122 -7q -122 -7g,-122 -7q -11o -7q -11o -7g -122 -7g,-11e -7g -11e -7q -114 -7q -114 -7g,-10q -7q -10q -7g -10g -7g -10g -7q,-106 -7q -106 -7g,-vs -7q -vs -7g -vi -7g -vi -7q -vs -7q,-156 -8e -156 -84 -148 -84 -148 -8e -156 -8e,-13u -8e -13u -84 -130 -84,-13u -8e -130 -8e,-12m -8e -12m -84,-13u -89 -130 -89,#G 79 3t -99,G ad -28 -8e,G a0 -52 -b,B 5a -7q -47,B -7t 55 -aa,B -4i -ag -3i,B -4d -9s -2u,B -4u -av -4e,B -61 -b4 -63,G -5e -b5 -5d,B -5e -b5 -5d,B -6m -ad -85,B -6o -9q -8e,B -6f -ar -75,B -6m -ad -86,B -3e -50 -2c,B -3e -50 -2a,B -3e -50 -2a,G -b1 -ch -48,B -be -t -am,B -bo -1p -a5,B -bt -2v -9m,B -fe -4s -5k,G -fg -7s -15,G -js -5s -2q,G -d3 6 -5k,B -ei 49 -ab,B -qs -bs -ad,B -hq 42 -8e,G -hq 42 -8e,B -ls -em -9r,B -ku -em -9r,B -jc -em -r,B -ie -em -r,B -gs -fc -b8,B -no -em -9r,B -mq -em -9r,G -s1 -ka -76,G -se -jp -7i,G -122 -ef -aj,G -13n -9q -5k,B 34 -3o -2q,G 9f 6 -6a,B -37 4s -b8,B -2g 1i -3s,B -2g 1i -3s,B -2g 1i -3s,B -kc -j4 -b8,G -p1 -hd -5k,G -rg -ec -38,B -rg -ec -38,###BMX#0 0';

game.ride({
    trackCode: '-18 1i 18 1i',
});
