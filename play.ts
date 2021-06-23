import { Chess } from 'chess.js';
import { Chessground }  from 'chessground';
import { Unit } from './unit';
import { toColor,toDests, aiPlay} from '../util'

declare var positions: any;
declare var currPos: any;
declare var currMov: any;
   export const vsRandom: Unit = {
  name: 'Learn My Skills Puzzle Rush',
  run(el) {
    const chess = new Chess();
      var fen=positions[currPos].fen;
      chess.load(fen);
   var mv=positions[currPos].moves[currMov].trim();
    var move= chess.move(mv,{ sloppy: true });
     const cg = Chessground(el, {
      fen:fen,
      orientation: toColor(chess),
      premovable: {
        enabled: true, 
        showDests: true,
        castle:true , 
      },
       predroppable: {
        enabled: true,
        events: { }
        }
    });
 
   setTimeout(() => {

      cg.move(move.from, move.to);
      cg.set({
        turnColor: toColor(chess),
        movable: {
          color: toColor(chess),
          dests: toDests(chess)
        },
        premovable: {
          enabled: true, 
          showDests: true,
          castle:true , 
        },
         predroppable: {
          enabled: true,
          events: { }
          }
      });
       currMov+=1;
      cg.playPremove();
    }, 1000)
    cg.set({
    turnColor :toColor(chess),
    orientation: toColor(chess),
    autoCastle: true,
      movable: {
        color: toColor(chess),                                                                                 
        free: false,
        events: {
          after: aiPlay(cg, chess, 1000)
        }
      },
   premovable: {
    enabled: true, 
    showDests: true,
    castle:true , 
  },
   predroppable: {
    enabled: true,
    events: { }
    }
 }   
    );
    
    return cg;
  }




};

