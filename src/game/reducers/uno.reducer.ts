import type { Card, ColorCarta } from '../interfaces/card.interface';

// state
export interface EstadoJuego {
  mazo: Card[];
  manoJugador: Card[];
  manoComputadora: Card[];
  cartasJugadas: Card[];
  turnoActual: 'jugador' | 'computadora';
  direccionJuego: 1 | -1;
  colorSeleccionado: ColorCarta | null;
  mensajeJuego: string;
  jugando: boolean;
  ganador: 'jugador' | 'computadora' | null;
  esperandoSeleccionColor: boolean;
  cartaComodinPendiente: {
    carta: Card;
    jugadaPor: 'jugador' | 'computadora';
  } | null;
}

// actions
export type ActionsJuego =
  | { type: 'INICIAR_JUEGO'; payload: { mazoBarajado: Card[] } }
  | { type: 'REINICIAR_JUEGO'; payload: { mazoBarajado: Card[] } }
  | { type: 'JUGADOR_JUEGA_CARTA'; payload: { indiceCarta: number } }
  | { type: 'JUGADOR_ROBA_CARTA' }
  | { type: 'JUGADOR_SELECCIONA_COLOR'; payload: { color: ColorCarta } }
  | {
      type: 'COMPUTADORA_JUEGA_CARTA';
      payload: { indiceCarta: number; carta: Card };
    }
  | { type: 'COMPUTADORA_ROBA_CARTA' }
  | {
      type: 'APLICAR_EFECTO_CARTA';
      payload: { carta: Card; jugadaPor: 'jugador' | 'computadora' };
    }
  | { type: 'CAMBIAR_TURNO'; payload: { turno: 'jugador' | 'computadora' } }
  | { type: 'ESTABLECER_MENSAJE'; payload: { mensaje: string } }
  | {
      type: 'ESTABLECER_GANADOR';
      payload: { ganador: 'jugador' | 'computadora' };
    }
  | {
      type: 'ROBAR_CARTAS';
      payload: { jugador: 'jugador' | 'computadora'; cantidad: number };
    };

// estado inicial
export const initialState: EstadoJuego = {
  mazo: [],
  manoJugador: [],
  manoComputadora: [],
  cartasJugadas: [],
  turnoActual: 'jugador',
  direccionJuego: 1,
  colorSeleccionado: null,
  mensajeJuego: 'Turno del Jugador',
  jugando: false,
  ganador: null,
  esperandoSeleccionColor: false,
  cartaComodinPendiente: null,
};

export const UnoReducer = (
  state: EstadoJuego,
  action: ActionsJuego
): EstadoJuego => {
  switch (action.type) {
    case 'INICIAR_JUEGO': {
      const mazoBarajado = [...action.payload.mazoBarajado];

      // 7 cartas a cada jugador
      const manoJugador = mazoBarajado.splice(0, 7);
      const manoComputadora = mazoBarajado.splice(0, 7);

      // carta inicial
      let primeraCarta = mazoBarajado.splice(0, 1)[0];
      while (
        primeraCarta.value === 'CambiarColor' ||
        primeraCarta.value === 'MasCuatro'
      ) {
        mazoBarajado.push(primeraCarta);
        primeraCarta = mazoBarajado.splice(0, 1)[0];
      }

      return {
        ...initialState,
        mazo: mazoBarajado,
        manoJugador,
        manoComputadora,
        cartasJugadas: [primeraCarta],
        jugando: true,
        turnoActual: 'jugador',
        mensajeJuego: 'Turno del Jugador',
      };
    }

    case 'REINICIAR_JUEGO': {
      const mazoBarajado = [...action.payload.mazoBarajado];
      const manoJugador = mazoBarajado.splice(0, 7);
      const manoComputadora = mazoBarajado.splice(0, 7);

      let primeraCarta = mazoBarajado.splice(0, 1)[0];
      while (
        primeraCarta.value === 'CambiarColor' ||
        primeraCarta.value === 'MasCuatro'
      ) {
        mazoBarajado.push(primeraCarta);
        primeraCarta = mazoBarajado.splice(0, 1)[0];
      }

      return {
        ...initialState,
        mazo: mazoBarajado,
        manoJugador,
        manoComputadora,
        cartasJugadas: [primeraCarta],
        jugando: true,
        turnoActual: 'jugador',
        mensajeJuego: 'Turno del Jugador',
      };
    }

    case 'JUGADOR_JUEGA_CARTA': {
      const { indiceCarta } = action.payload;

      // remover carta de mano
      const nuevaManoJugador = state.manoJugador.filter(
        (_, index) => index !== indiceCarta
      );
      const cartaJugada = state.manoJugador[indiceCarta];

      // agregar a cartas jugadas
      const nuevaPilaDescarte = [...state.cartasJugadas, cartaJugada];

      // check win
      if (nuevaManoJugador.length === 0) {
        return {
          ...state,
          manoJugador: nuevaManoJugador,
          cartasJugadas: nuevaPilaDescarte,
          ganador: 'jugador',
          mensajeJuego: 'Felicidades, ganaste!',
          jugando: false,
        };
      }

      // Continuar el juego
      return {
        ...state,
        manoJugador: nuevaManoJugador,
        cartasJugadas: nuevaPilaDescarte,
        colorSeleccionado: null,
      };
    }

    case 'JUGADOR_ROBA_CARTA': {
      if (state.mazo.length === 0) return state;

      const nuevoMazo = [...state.mazo];
      const cartaRobada = nuevoMazo.pop()!;

      return {
        ...state,
        mazo: nuevoMazo,
        manoJugador: [...state.manoJugador, cartaRobada],
        turnoActual: 'computadora',
        mensajeJuego: 'Turno de la Computadora',
      };
    }

    case 'JUGADOR_SELECCIONA_COLOR': {
      return {
        ...state,
        colorSeleccionado: action.payload.color,
        esperandoSeleccionColor: false,
        cartaComodinPendiente: null,
        turnoActual: 'computadora',
        mensajeJuego: 'Turno de la Computadora',
      };
    }

    case 'COMPUTADORA_JUEGA_CARTA': {
      const { indiceCarta } = action.payload;

      // quitar carta mano
      const nuevaManoComputadora = state.manoComputadora.filter(
        (_, index) => index !== indiceCarta
      );
      const cartaJugada = state.manoComputadora[indiceCarta];

      // añadir a cartas jugadas
      const nuevaPilaDescarte = [...state.cartasJugadas, cartaJugada];

      // check win pc
      if (nuevaManoComputadora.length === 0) {
        return {
          ...state,
          manoComputadora: nuevaManoComputadora,
          cartasJugadas: nuevaPilaDescarte,
          ganador: 'computadora',
          mensajeJuego: 'Computadora gana',
          jugando: false,
        };
      }

      return {
        ...state,
        manoComputadora: nuevaManoComputadora,
        cartasJugadas: nuevaPilaDescarte,
        colorSeleccionado: null,
      };
    }

    case 'COMPUTADORA_ROBA_CARTA': {
      if (state.mazo.length === 0) return state;

      const nuevoMazo = [...state.mazo];
      const cartaRobada = nuevoMazo.pop()!;

      return {
        ...state,
        mazo: nuevoMazo,
        manoComputadora: [...state.manoComputadora, cartaRobada],
        turnoActual: 'jugador',
        mensajeJuego: 'Turno del Jugador',
      };
    }

    case 'APLICAR_EFECTO_CARTA': {
      const { carta, jugadaPor } = action.payload;

      // carta skip
      if (carta.value === 'Saltar') {
        return {
          ...state,
          mensajeJuego:
            jugadaPor === 'jugador'
              ? 'Turno del Jugador'
              : 'Turno de la Computadora',
        };
      }

      // carta reversa misma funcion skip
      if (carta.value === 'Reversa') {
        return {
          ...state,
          direccionJuego: state.direccionJuego === 1 ? -1 : 1,
          mensajeJuego:
            jugadaPor === 'jugador'
              ? 'Turno del Jugador'
              : 'Turno de la Computadora',
        };
      }

      // carta +2
      if (carta.value === 'MasDos') {
        const nuevoMazo = [...state.mazo];
        const cartasRobadas: Card[] = [];

        // push 2 cartas a la mano pop 2 cartas al mazo
        for (let i = 0; i < 2 && nuevoMazo.length > 0; i++) {
          cartasRobadas.push(nuevoMazo.pop()!);
        }

        if (jugadaPor === 'computadora') {
          return {
            ...state,
            mazo: nuevoMazo,
            manoJugador: [...state.manoJugador, ...cartasRobadas],
            mensajeJuego: 'Turno del Jugador',
          };
        } else {
          return {
            ...state,
            mazo: nuevoMazo,
            manoComputadora: [...state.manoComputadora, ...cartasRobadas],
            mensajeJuego: 'Turno de la Computadora',
          };
        }
      }

      // cambiar color
      if (carta.value === 'CambiarColor') {
        if (jugadaPor === 'jugador') {
          // elegir color
          return {
            ...state,
            esperandoSeleccionColor: true,
            cartaComodinPendiente: { carta: carta, jugadaPor: jugadaPor },
            mensajeJuego: 'Elige un color',
          };
        } else {
          return {
            ...state,
            turnoActual: 'jugador',
            mensajeJuego: 'Turno del Jugador',
          };
        }
      }

      // carta +4
      if (carta.value === 'MasCuatro') {
        const nuevoMazo = [...state.mazo];
        const cartasRobadas: Card[] = [];

        // push 4 a mano pop 4 a mazo
        for (let i = 0; i < 4 && nuevoMazo.length > 0; i++) {
          cartasRobadas.push(nuevoMazo.pop()!);
        }

        if (jugadaPor === 'jugador') {
          return {
            ...state,
            mazo: nuevoMazo,
            manoComputadora: [...state.manoComputadora, ...cartasRobadas],
            esperandoSeleccionColor: true,
            cartaComodinPendiente: { carta: carta, jugadaPor: jugadaPor },
            mensajeJuego: 'Elige un color',
          };
        } else {
          return {
            ...state,
            mazo: nuevoMazo,
            manoJugador: [...state.manoJugador, ...cartasRobadas],
            turnoActual: 'jugador',
            mensajeJuego: 'Turno del Jugador',
          };
        }
      }

      // carta normal (cambio de turno)
      return {
        ...state,
        turnoActual: jugadaPor === 'jugador' ? 'computadora' : 'jugador',
        mensajeJuego:
          jugadaPor === 'jugador'
            ? 'Turno de la Computadora'
            : 'Turno del Jugador',
      };
    }

    case 'ROBAR_CARTAS': {
      const { jugador, cantidad } = action.payload;
      const nuevoMazo = [...state.mazo];
      const cartasRobadas: Card[] = [];

      for (let i = 0; i < cantidad && nuevoMazo.length > 0; i++) {
        cartasRobadas.push(nuevoMazo.pop()!);
      }

      if (jugador === 'jugador') {
        return {
          ...state,
          mazo: nuevoMazo,
          manoJugador: [...state.manoJugador, ...cartasRobadas],
        };
      } else {
        return {
          ...state,
          mazo: nuevoMazo,
          manoComputadora: [...state.manoComputadora, ...cartasRobadas],
        };
      }
    }

    case 'CAMBIAR_TURNO': {
      return {
        ...state,
        turnoActual: action.payload.turno,
        mensajeJuego:
          action.payload.turno === 'jugador'
            ? 'Turno del Jugador'
            : 'Turno de la Computadora',
      };
    }

    case 'ESTABLECER_MENSAJE': {
      return {
        ...state,
        mensajeJuego: action.payload.mensaje,
      };
    }

    case 'ESTABLECER_GANADOR': {
      return {
        ...state,
        ganador: action.payload.ganador,
        jugando: false,
        mensajeJuego:
          action.payload.ganador === 'jugador'
            ? 'Felicidades, ganaste!'
            : 'Computadora gana',
      };
    }
    default:
      return state;
  }
};
