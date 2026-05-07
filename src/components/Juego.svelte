<script>
  import { createBoard, generatePieces, placePiece, checkWin, getAttrName } from '../lib/gameLogic.js';
  import { sfxSelect, sfxPlace, sfxWin, sfxDraw } from '../lib/sfx.js';
  import Tablero from './Tablero.svelte';
  import PiezasDisponibles from './PiezasDisponibles.svelte';
  import Pieza from './Pieza.svelte';

  let { players, onRestart } = $props();

  let board = $state(createBoard());
  let availablePieces = $state(generatePieces());
  let currentPlayer = $state(1);
  let phase = $state('select'); // 'select' = elegir pieza para rival, 'place' = colocar pieza
  let selectedPiece = $state(null); // pieza elegida para el rival
  let pieceToPlace = $state(null); // pieza que el jugador activo debe colocar
  let winLine = $state(null);
  let gameOver = $state(false);
  let result = $state(null);
  let isFirstTurn = $state(true);

  // En el primer turno, J1 solo elige pieza para J2 (no coloca nada)
  // Después: J activo coloca la pieza que le dieron, luego elige pieza para el rival

  function handleSelectPiece(piece) {
    if (gameOver) return;
    sfxSelect();
    selectedPiece = piece;
  }

  function confirmSelection() {
    if (!selectedPiece || gameOver) return;

    // Quitar pieza de disponibles
    availablePieces = availablePieces.filter(p => p.id !== selectedPiece.id);

    if (isFirstTurn) {
      // Primer turno: J1 eligió pieza, ahora J2 la coloca
      pieceToPlace = selectedPiece;
      selectedPiece = null;
      currentPlayer = 2;
      phase = 'place';
      isFirstTurn = false;
    } else {
      // Turno normal: ya colocó, ahora eligió pieza para el rival
      pieceToPlace = selectedPiece;
      selectedPiece = null;
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      phase = 'place';
    }
  }

  function handleCellClick(row, col) {
    if (gameOver || phase !== 'place' || !pieceToPlace) return;

    const newBoard = placePiece(board, row, col, pieceToPlace);
    if (!newBoard) return;

    board = newBoard;
    sfxPlace();
    pieceToPlace = null;

    const check = checkWin(board);
    if (check) {
      gameOver = true;
      if (check.won) {
        winLine = check.line;
        result = { type: 'win', player: currentPlayer, attr: check.attr, value: check.value };
        sfxWin();
      } else {
        result = { type: 'draw' };
        sfxDraw();
      }
      return;
    }

    // Pasar a elegir pieza para el rival
    phase = 'select';
  }

  function replay() {
    board = createBoard();
    availablePieces = generatePieces();
    currentPlayer = 1;
    phase = 'select';
    selectedPiece = null;
    pieceToPlace = null;
    winLine = null;
    gameOver = false;
    result = null;
    isFirstTurn = true;
  }

  function getPhaseText() {
    if (phase === 'select') return `Elige una pieza para ${players[currentPlayer === 1 ? 1 : 0]}`;
    return 'Coloca la pieza en el tablero';
  }
</script>

<div class="flex flex-row items-center justify-center h-[100dvh] gap-6 px-3 py-2 overflow-hidden">
  <Tablero {board} {winLine} canPlace={phase === 'place'} onCellClick={handleCellClick} />

  <div class="flex flex-col items-center justify-center gap-6 h-[90dvh] ml-[6vw] w-[220px] md:w-[280px] shrink-0 py-2">
    {#if gameOver}
      <div></div>
      <div class="text-center flex flex-col gap-3">
        {#if result.type === 'draw'}
          <p class="text-xl font-bold uppercase text-[var(--cream)] opacity-60">Empate</p>
          <p class="text-xs opacity-50">Todas las piezas colocadas</p>
        {:else}
          <p class="text-xl font-bold uppercase text-[var(--gold)]">¡Victoria!</p>
          <p class="text-sm text-[var(--cream)]">{players[result.player - 1]}</p>
          <p class="text-xs opacity-60">4 piezas {getAttrName(result.attr, result.value)}s en línea</p>
        {/if}

        <button
          onclick={replay}
          class="mt-2 px-4 py-2 bg-[var(--gold)] hover:brightness-110 text-[var(--bg)] font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
        >
          🔄 Jugar de nuevo
        </button>
      </div>
      <button
        onclick={onRestart}
        class="px-4 py-2 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] opacity-50 text-xs uppercase tracking-wider rounded transition-all cursor-pointer border border-[var(--gold)] border-opacity-20"
      >
        🏠 Inicio
      </button>
    {:else}
      <!-- Top: nombre y fase -->
      <div class="text-center">
        <p class="text-base uppercase tracking-wider text-[var(--gold)] font-bold">
          {players[currentPlayer - 1]}
        </p>
        <p class="text-xs text-[var(--cream)] opacity-50 mt-0.5">{getPhaseText()}</p>
      </div>

      <!-- Middle: piezas o pieza a colocar -->
      <div class="flex flex-col items-center gap-3">
        {#if phase === 'place' && pieceToPlace}
          <div class="flex flex-col items-center gap-2">
            <p class="text-sm opacity-60">Pieza a colocar:</p>
            <div class="w-16 h-16 flex items-center justify-center">
              <Pieza piece={pieceToPlace} size="md" placed={true} />
            </div>
          </div>
        {/if}

        {#if phase === 'select'}
          <PiezasDisponibles
            pieces={availablePieces}
            {selectedPiece}
            canSelect={true}
            onSelect={handleSelectPiece}
          />
        {/if}

        <!-- Espacio fijo para botón confirmar -->
        <div class="h-10 flex items-center">
          {#if phase === 'select' && selectedPiece}
            <button
              onclick={confirmSelection}
              class="px-4 py-2 bg-[var(--gold)] hover:brightness-110 text-[var(--bg)] font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
            >
              Confirmar
            </button>
          {/if}
        </div>
      </div>

      <!-- Bottom: botón inicio -->
      <button
        onclick={onRestart}
        class="px-4 py-2 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] opacity-50 text-xs uppercase tracking-wider rounded transition-all cursor-pointer border border-[var(--gold)] border-opacity-20"
      >
        🏠 Inicio
      </button>
    {/if}
  </div>
</div>
