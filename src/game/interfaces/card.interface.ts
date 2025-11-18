export type ColorCarta = 'Rojo' | 'Azul' | 'Verde' | 'Amarillo';

export type ValorCarta =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'Saltar'
  | 'Reversa'
  | 'MasDos';

export type CartaEspecial = 'CambiarColor' | 'MasCuatro';

export interface Card {
  id: string;
  color?: ColorCarta;
  value: ValorCarta | CartaEspecial;
  image: string;
}
