<script>
  import { createBoard, generatePieces, placePiece, checkWin, getAttrName } from '../lib/gameLogic.js';
  import { sfxSelect, sfxPlace, sfxWin, sfxDraw } from '../lib/sfx.js';
  import { saveGameState, loadGameState, clearGameState } from '../lib/storage.js';
  import Tablero from './Tablero.svelte';
  import PiezasDisponibles from './PiezasDisponibles.svelte';
  import Pieza from './Pieza.svelte';

  let { players, onRestart } = $props();

  // Cargar estado guardado o crear nuevo
  const saved = loadGameState();
  let board = $state(saved ? saved.board : createBoard());
  let availablePieces = $state(saved ? saved.availablePieces : generatePieces());
  let currentPlayer = $state(saved ? saved.currentPlayer : 1);
  let phase = $state(saved ? saved.phase : 'select');
  let selectedPiece = $state(null);
  let pieceToPlace = $state(saved ? saved.pieceToPlace : null);
  let winLine = $state(null);
  let gameOver = $state(false);
  let result = $state(null);
  let isFirstTurn = $state(saved ? saved.isFirstTurn : true);

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
      pieceToPlace = selectedPiece;
      selectedPiece = null;
      currentPlayer = 2;
      phase = 'place';
      isFirstTurn = false;
    } else {
      pieceToPlace = selectedPiece;
      selectedPiece = null;
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      phase = 'place';
    }
    saveGameState({ board, availablePieces, currentPlayer, phase, pieceToPlace, isFirstTurn, players });
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
      clearGameState();
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
    saveGameState({ board, availablePieces, currentPlayer, phase, pieceToPlace, isFirstTurn, players });
  }

  function replay() {
    clearGameState();
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

  <div class="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-[90dvh] md:h-auto ml-[6vw] w-[220px] md:w-[280px] shrink-0 gap-4">
    {#if gameOver}
      <!-- Fila 1: vacío -->
      <div></div>
      <!-- Fila 2: resultado -->
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
      <!-- Fila 3: inicio -->
      <button
        onclick={onRestart}
        class="px-4 py-2 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] opacity-50 text-xs uppercase tracking-wider rounded transition-all cursor-pointer border border-[var(--gold)] border-opacity-20"
      >
        🏠 Inicio
      </button>
    {:else}
      <!-- Fila 1: nombre y fase -->
      <div class="text-center">
        <p class="text-base uppercase tracking-wider text-[var(--gold)] font-bold">
          {players[currentPlayer - 1]}
        </p>
        <p class="text-xs text-[var(--cream)] opacity-50 mt-0.5">{getPhaseText()}</p>
      </div>

      <!-- Fila 2: piezas / pieza a colocar / confirmar -->
      <div class="flex flex-col items-center justify-center gap-3">
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

      <!-- Fila 3: botón inicio -->
      <button
        onclick={onRestart}
        class="px-4 py-2 bg-[var(--cell)] hover:bg-[var(--cell-hover)] text-[var(--cream)] opacity-50 text-xs uppercase tracking-wider rounded transition-all cursor-pointer border border-[var(--gold)] border-opacity-20"
      >
        🏠 Inicio
      </button>
    {/if}
  </div>
</div>
