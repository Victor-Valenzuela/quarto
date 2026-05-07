# Quarto — Reglas Completas

## Identidad visual

- **Estilo:** Elegante/minimalista, madera clara, piezas geométricas
- **Paleta:** Tonos madera (beige, marrón claro, oscuro) + blanco crema + acentos dorados
- **Tipografía:** Serif elegante, espaciada
- **Tono:** "Piensa dos veces"

## Resumen

Juego de 2 jugadores. 16 piezas únicas con 4 atributos binarios. Gana quien alinee 4 piezas que compartan al menos un atributo. El twist: tu rival elige qué pieza juegas.

## Piezas (16 únicas)

Cada pieza tiene 4 atributos con 2 valores posibles:

- **Altura:** Alta / Baja
- **Color:** Clara / Oscura
- **Forma:** Redonda / Cuadrada
- **Relleno:** Hueca / Sólida

Total: 2⁴ = 16 combinaciones únicas.

## Setup

- Tablero: grilla 4×4 (16 espacios)
- Las 16 piezas disponibles fuera del tablero
- Se decide quién empieza al azar

## Turno (2 fases)

1. **Colocar:** El jugador activo coloca la pieza que le dieron en cualquier espacio vacío del tablero
2. **Elegir:** El jugador activo elige una pieza de las disponibles y se la da al rival

## Condición de victoria

Alinear 4 piezas en línea (horizontal, vertical o diagonal) que compartan AL MENOS un atributo en común. Ejemplos:

- 4 piezas altas (sin importar color, forma o relleno)
- 4 piezas redondas
- 4 piezas oscuras y sólidas (comparten 2 atributos, basta con 1)

## Quién gana

- El jugador que COLOCA la pieza que completa la línea gana
- Si colocas una pieza y no te das cuenta de que ganaste, el rival puede reclamarlo en su turno
- Si nadie alinea 4 y se llenan los 16 espacios: empate

## Pantallas

1. **Inicio** — Título + botón jugar
2. **Juego** — Tablero 4×4, piezas disponibles, pieza seleccionada para el rival, indicador de turno
3. **Fin** — Ganador + línea ganadora resaltada + atributo compartido + botón reiniciar
