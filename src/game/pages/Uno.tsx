import { useReducer, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';

import { shuffle } from 'lodash';

import bg from '../../assets/Game-bg.png';
import type {
  Card,
  ColorCarta,
  ValorCarta,
} from '../interfaces/card.interface';
import { UnoReducer, initialState } from '../reducers/uno.reducer';

const imagenesCartas = {
  Rojo_0: new URL('../../assets/Red_0.png', import.meta.url).href,
  Rojo_1: new URL('../../assets/Red_1.png', import.meta.url).href,
  Rojo_2: new URL('../../assets/Red_2.png', import.meta.url).href,
  Rojo_3: new URL('../../assets/Red_3.png', import.meta.url).href,
  Rojo_4: new URL('../../assets/Red_4.png', import.meta.url).href,
  Rojo_5: new URL('../../assets/Red_5.png', import.meta.url).href,
  Rojo_6: new URL('../../assets/Red_6.png', import.meta.url).href,
  Rojo_7: new URL('../../assets/Red_7.png', import.meta.url).href,
  Rojo_8: new URL('../../assets/Red_8.png', import.meta.url).href,
  Rojo_9: new URL('../../assets/Red_9.png', import.meta.url).href,
  Rojo_Saltar: new URL('../../assets/Red_Skip.png', import.meta.url).href,
  Rojo_Reversa: new URL('../../assets/Red_Reverse.png', import.meta.url).href,
  Rojo_MasDos: new URL('../../assets/Red_Draw.png', import.meta.url).href,

  Azul_0: new URL('../../assets/Blue_0.png', import.meta.url).href,
  Azul_1: new URL('../../assets/Blue_1.png', import.meta.url).href,
  Azul_2: new URL('../../assets/Blue_2.png', import.meta.url).href,
  Azul_3: new URL('../../assets/Blue_3.png', import.meta.url).href,
  Azul_4: new URL('../../assets/Blue_4.png', import.meta.url).href,
  Azul_5: new URL('../../assets/Blue_5.png', import.meta.url).href,
  Azul_6: new URL('../../assets/Blue_6.png', import.meta.url).href,
  Azul_7: new URL('../../assets/Blue_7.png', import.meta.url).href,
  Azul_8: new URL('../../assets/Blue_8.png', import.meta.url).href,
  Azul_9: new URL('../../assets/Blue_9.png', import.meta.url).href,
  Azul_Saltar: new URL('../../assets/Blue_Skip.png', import.meta.url).href,
  Azul_Reversa: new URL('../../assets/Blue_Reverse.png', import.meta.url).href,
  Azul_MasDos: new URL('../../assets/Blue_Draw.png', import.meta.url).href,

  Verde_0: new URL('../../assets/Green_0.png', import.meta.url).href,
  Verde_1: new URL('../../assets/Green_1.png', import.meta.url).href,
  Verde_2: new URL('../../assets/Green_2.png', import.meta.url).href,
  Verde_3: new URL('../../assets/Green_3.png', import.meta.url).href,
  Verde_4: new URL('../../assets/Green_4.png', import.meta.url).href,
  Verde_5: new URL('../../assets/Green_5.png', import.meta.url).href,
  Verde_6: new URL('../../assets/Green_6.png', import.meta.url).href,
  Verde_7: new URL('../../assets/Green_7.png', import.meta.url).href,
  Verde_8: new URL('../../assets/Green_8.png', import.meta.url).href,
  Verde_9: new URL('../../assets/Green_9.png', import.meta.url).href,
  Verde_Saltar: new URL('../../assets/Green_Skip.png', import.meta.url).href,
  Verde_Reversa: new URL('../../assets/Green_Reverse.png', import.meta.url)
    .href,
  Verde_MasDos: new URL('../../assets/Green_Draw.png', import.meta.url).href,

  Amarillo_0: new URL('../../assets/Yellow_0.png', import.meta.url).href,
  Amarillo_1: new URL('../../assets/Yellow_1.png', import.meta.url).href,
  Amarillo_2: new URL('../../assets/Yellow_2.png', import.meta.url).href,
  Amarillo_3: new URL('../../assets/Yellow_3.png', import.meta.url).href,
  Amarillo_4: new URL('../../assets/Yellow_4.png', import.meta.url).href,
  Amarillo_5: new URL('../../assets/Yellow_5.png', import.meta.url).href,
  Amarillo_6: new URL('../../assets/Yellow_6.png', import.meta.url).href,
  Amarillo_7: new URL('../../assets/Yellow_7.png', import.meta.url).href,
  Amarillo_8: new URL('../../assets/Yellow_8.png', import.meta.url).href,
  Amarillo_9: new URL('../../assets/Yellow_9.png', import.meta.url).href,
  Amarillo_Saltar: new URL('../../assets/Yellow_Skip.png', import.meta.url)
    .href,
  Amarillo_Reversa: new URL('../../assets/Yellow_Reverse.png', import.meta.url)
    .href,
  Amarillo_MasDos: new URL('../../assets/Yellow_Draw.png', import.meta.url)
    .href,

  CambiarColor: new URL('../../assets/Wild.png', import.meta.url).href,
  MasCuatro: new URL('../../assets/Wild_Draw.png', import.meta.url).href,

  Portada: new URL('../../assets/Deck.png', import.meta.url).href,
};

export const Uno = () => {
  const navigate = useNavigate();

  const [
    {
      mazo: mazo,
      manoJugador: manoJugador,
      manoComputadora: manoComputadora,
      cartasJugadas: cartasJugadas,
      turnoActual,
      colorSeleccionado: colorSeleccionado,
      mensajeJuego: mensajeJuego,
      jugando: jugando,
      ganador: ganador,
      esperandoSeleccionColor: esperandoSeleccion,
      cartaComodinPendiente,
    },
    dispatch,
  ] = useReducer(UnoReducer, initialState);

  const jugadorActual = turnoActual === 'jugador' ? 'jugador' : 'computadora';

  const comodinPendiente = cartaComodinPendiente
    ? {
        card: cartaComodinPendiente.carta,
        playedBy:
          cartaComodinPendiente.jugadaPor === 'jugador'
            ? 'jugador'
            : ('computadora' as 'jugador' | 'computadora'),
      }
    : null;

  const crearMazo = (): Card[] => {
    const nuevoMazo: Card[] = [];
    const colores: ColorCarta[] = ['Rojo', 'Azul', 'Verde', 'Amarillo'];
    const valores: ValorCarta[] = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Saltar',
      'Reversa',
      'MasDos',
    ];

    // crear cartas de colores
    colores.forEach((color) => {
      valores.forEach((value) => {
        const count = 1;

        for (let i = 0; i < count; i++) {
          nuevoMazo.push({
            id: `${color}_${value}_${i}`,
            color,
            value,
            image:
              imagenesCartas[
                `${color}_${value}` as keyof typeof imagenesCartas
              ],
          });
        }
      });
    });

    // 4 comodines cambiar de color
    for (let i = 0; i < 4; i++) {
      nuevoMazo.push({
        id: `Wild_${i}`,
        value: 'CambiarColor',
        image: imagenesCartas.CambiarColor,
      });
    }

    // 4 comodines +4
    for (let i = 0; i < 4; i++) {
      nuevoMazo.push({
        id: `Wild_Draw_${i}`,
        value: 'MasCuatro',
        image: imagenesCartas.MasCuatro,
      });
    }

    return nuevoMazo;
  };

  const shuffleBaraja = (cartas: Card[]): Card[] => {
    return shuffle([...cartas]);
  };

  const iniciarJuego = () => {
    const mazoBarajado = shuffleBaraja(crearMazo());
    dispatch({ type: 'INICIAR_JUEGO', payload: { mazoBarajado } });
  };

  const cartaJugable = (carta: Card, cartaTop: Card): boolean => {
    if (carta.value === 'CambiarColor' || carta.value === 'MasCuatro') {
      return true;
    }

    if (colorSeleccionado) {
      return carta.color === colorSeleccionado;
    }

    return carta.color === cartaTop.color || carta.value === cartaTop.value;
  };

  // tomar carta del mazo
  const drawCard = () => {
    if (jugadorActual !== 'jugador' || mazo.length === 0) return;

    dispatch({ type: 'JUGADOR_ROBA_CARTA' });
  };

  const jugarCarta = (cardIndex: number) => {
    if (jugadorActual !== 'jugador') return;

    const carta = manoJugador[cardIndex];
    const cartaTop = cartasJugadas[cartasJugadas.length - 1];

    if (!cartaJugable(carta, cartaTop)) {
      dispatch({
        type: 'ESTABLECER_MENSAJE',
        payload: { mensaje: '¡No puedes jugar esa carta!' },
      });
      return;
    }

    // jugar la carta
    dispatch({
      type: 'JUGADOR_JUEGA_CARTA',
      payload: { indiceCarta: cardIndex },
    });

    // aplicar efecto si es comodin
    aplicarEfectoCarta(carta, 'jugador');
  };

  const aplicarEfectoCarta = (
    carta: Card,
    jugadaPor: 'jugador' | 'computadora'
  ) => {
    if (
      jugadaPor === 'computadora' &&
      (carta.value === 'CambiarColor' || carta.value === 'MasCuatro')
    ) {
      const color = colorComputadora();
      dispatch({
        type: 'APLICAR_EFECTO_CARTA',
        payload: {
          carta: carta,
          jugadaPor: 'computadora',
        },
      });
      // timeOut para cambiar de color
      setTimeout(() => {
        dispatch({
          type: 'JUGADOR_SELECCIONA_COLOR',
          payload: { color },
        });
      }, 100);
      return;
    }

    // aplicar efecto de la carta
    dispatch({
      type: 'APLICAR_EFECTO_CARTA',
      payload: {
        carta: carta,
        jugadaPor: jugadaPor === 'jugador' ? 'jugador' : 'computadora',
      },
    });
  };

  const seleccionarColor = (color: ColorCarta) => {
    if (!esperandoSeleccion || !comodinPendiente) return;

    dispatch({
      type: 'JUGADOR_SELECCIONA_COLOR',
      payload: { color },
    });
  };

  // pc elige color de forma automatica
  const colorComputadora = (): ColorCarta => {
    const colorCount: Record<ColorCarta, number> = {
      Rojo: 0,
      Azul: 0,
      Verde: 0,
      Amarillo: 0,
    };

    manoComputadora.forEach((card) => {
      if (card.color) {
        colorCount[card.color]++;
      }
    });

    // color mas comun como principal
    let maxColor: ColorCarta = 'Rojo';
    let maxCount = 0;

    (Object.keys(colorCount) as ColorCarta[]).forEach((color) => {
      if (colorCount[color] > maxCount) {
        maxCount = colorCount[color];
        maxColor = color;
      }
    });

    return maxColor;
  };

  // callback para memorizar funcion
  const turnoComputadora = useCallback(() => {
    if (jugadorActual !== 'computadora' || manoComputadora.length === 0) return; //validacion

    // buscar cartas jugables
    const cartaTop = cartasJugadas[cartasJugadas.length - 1];

    const cartasJugables = manoComputadora
      .map((carta, index) => ({ carta, index }))
      .filter(({ carta }) => cartaJugable(carta, cartaTop));

    // robar carta si no tiene ninguna
    if (cartasJugables.length === 0) {
      dispatch({ type: 'COMPUTADORA_ROBA_CARTA' });
      return;
    }
    let cartaSeleccionada = cartasJugables[0];

    // cartas especiales
    const cartasEspeciales = cartasJugables.filter(
      ({ carta }) =>
        carta.value === 'Saltar' ||
        carta.value === 'Reversa' ||
        carta.value === 'MasDos'
    );

    if (cartasEspeciales.length > 0) {
      cartaSeleccionada = cartasEspeciales[0];
    } else {
      const cartaMasCuatro = cartasJugables.filter(
        ({ carta }) => carta.value === 'MasCuatro'
      );
      if (cartaMasCuatro.length > 0 && manoComputadora.length > 3) {
        cartaSeleccionada = cartaMasCuatro[0];
      } else {
        const cartaCambiarColor = cartasJugables.filter(
          ({ carta }) => carta.value === 'CambiarColor'
        );
        if (cartaCambiarColor.length > 0 && manoComputadora.length > 3) {
          cartaSeleccionada = cartaCambiarColor[0];
        } else {
          const cartaNormal = cartasJugables.filter(
            ({ carta }) =>
              carta.value !== 'CambiarColor' && carta.value !== 'MasCuatro'
          );
          if (cartaNormal.length > 0) {
            cartaSeleccionada = cartaNormal[0];
          }
        }
      }
    }

    // jugar carta seleccionada
    dispatch({
      type: 'COMPUTADORA_JUEGA_CARTA',
      payload: {
        indiceCarta: cartaSeleccionada.index,
        carta: cartaSeleccionada.carta,
      },
    });

    // timeout efecto carta
    setTimeout(() => {
      aplicarEfectoCarta(cartaSeleccionada.carta, 'computadora');
    }, 1500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jugadorActual, manoComputadora, mazo, cartasJugadas, jugando, ganador]);

  // iniciar juego
  useEffect(() => {
    iniciarJuego();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect para inicializar el turno de la pc
  useEffect(() => {
    if (jugadorActual === 'computadora' && jugando && !ganador) {
      const timer = setTimeout(() => {
        turnoComputadora();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [jugadorActual, jugando, ganador, turnoComputadora]);

  return (
    <div
      className='bg-cover bg-center min-h-screen flex flex-col items-center justify-between p-4'
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* turnos */}
      <div className='w-full max-w-6xl flex justify-center items-center mt-4'>
        <div className='bg-blue-600 rounded-lg px-8 py-4 shadow-lg'>
          <p className='text-2xl font-bold text-white'>{mensajeJuego}</p>
        </div>

        <div className='ml-10 '>
          <button
            className='text-white text-2xl font-bold cursor-pointer transition hover:scale-105 active:scale-100 bg-red-700 rounded-lg px-8 py-4 shadow-lg'
            onClick={() => iniciarJuego()}
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* computadora */}
      <div className='flex gap-2 mt-6 flex-wrap justify-center max-w-6xl'>
        {manoComputadora.map((card) => (
          <div
            key={card.id}
            className='w-20 h-28 rounded-lg shadow-lg transition-transform hover:scale-105'
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundSize: 'cover',
            }}
          />
        ))}
      </div>

      {/* baraja */}
      <div className='flex gap-12 items-center'>
        <div
          className='relative cursor-pointer transition-transform hover:scale-110'
          onClick={jugadorActual === 'jugador' ? drawCard : undefined}
        >
          <div
            className='w-32 h-48 rounded-xl shadow-2xl'
            style={{
              backgroundImage: `url(${imagenesCartas.Portada})`,
              backgroundSize: 'cover',
            }}
          />
          <p className='text-center text-white font-bold mt-2 text-lg bg-black/50 rounded px-3 py-1'>
            {mazo.length} cartas
          </p>
        </div>

        {/* carta actual */}
        <div className='relative'>
          {cartasJugadas.length > 0 && (
            <div
              className='w-32 h-48 rounded-xl shadow-2xl'
              style={{
                backgroundImage: `url(${
                  cartasJugadas[cartasJugadas.length - 1].image
                })`,
                backgroundSize: 'cover',
              }}
            />
          )}
          {colorSeleccionado && (
            <div
              className={`absolute -top-4 -right-4 w-12 h-12 rounded-full border-4 border-white shadow-lg`}
              style={{ backgroundColor: colorSeleccionado.toLowerCase() }}
            />
          )}
        </div>
      </div>

      {/* jugador */}
      <div className='flex gap-3 mb-6 overflow-x-auto max-w-full pb-4'>
        {manoJugador.map((card, index) => (
          <div
            key={card.id}
            className={`w-24 h-36 rounded-xl shadow-xl transition-all cursor-pointer
              ${
                jugadorActual === 'jugador' &&
                cartaJugable(card, cartasJugadas[cartasJugadas.length - 1])
                  ? 'hover:scale-110 hover:-translate-y-6 border-4 border-yellow-400'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            style={{
              backgroundImage: `url(${card.image})`,
              backgroundSize: 'cover',
            }}
            onClick={() => jugadorActual === 'jugador' && jugarCarta(index)}
          />
        ))}
      </div>

      {/* modal endgame */}
      {ganador && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-12 text-center shadow-2xl'>
            <h2 className='text-4xl font-bold mb-8 text-gray-800'>
              {ganador === 'jugador' ? 'GANASTE!' : 'Gano la computadora'}
            </h2>
            <div className='flex gap-4 justify-center'>
              <button
                onClick={iniciarJuego}
                className='bg-green-400 rounded-md text-white py-5 px-10 text-2xl font-bold mt-30 cursor-pointer transition hover:scale-110 active:scale-100 shadow-[0_5px_10px_rgba(0,0,0,1)]'
              >
                Jugar de nuevo
              </button>
              <button
                onClick={() => navigate('/')}
                className='bg-red-900 rounded-md text-white py-5 px-10 text-2xl font-bold mt-30 cursor-pointer transition hover:scale-110 active:scale-100 shadow-[0_5px_10px_rgba(0,0,0,1)]'
              >
                Regresar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* componente para elegir el color */}
      {esperandoSeleccion && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-12 text-center shadow-2xl'>
            <h2 className='text-3xl font-bold mb-8 text-gray-800'>
              Elige un color
            </h2>
            <div className='grid grid-cols-2 gap-6'>
              <button
                onClick={() => seleccionarColor('Rojo')}
                className='w-32 h-32 rounded-2xl shadow-lg hover:scale-110 transition-transform bg-red-600'
              />
              <button
                onClick={() => seleccionarColor('Azul')}
                className='w-32 h-32 rounded-2xl shadow-lg hover:scale-110 transition-transform bg-blue-600'
              />
              <button
                onClick={() => seleccionarColor('Amarillo')}
                className='w-32 h-32 rounded-2xl shadow-lg hover:scale-110 transition-transform bg-yellow-400'
              />
              <button
                onClick={() => seleccionarColor('Verde')}
                className='w-32 h-32 rounded-2xl shadow-lg hover:scale-110 transition-transform bg-green-600'
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
