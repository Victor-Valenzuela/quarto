<script>
  import { BOARD_SIZE } from '../lib/gameLogic.js';
  import Pieza from './Pieza.svelte';

  let { board, winLine, canPlace, onCellClick } = $props();

  function isWinCell(row, col) {
    if (!winLine || winLine.length === 0) return false;
    return winLine.some(([r, c]) => r === row && c === col);
  }

  function getWinIndex(row, col) {
    if (!winLine) return -1;
    return winLine.findIndex(([r, c]) => r === row && c === col);
  }
</script>

<div
  class="grid gap-3 p-4 rounded"
  style="grid-template-columns: repeat({BOARD_SIZE}, 1fr); grid-template-rows: repeat({BOARD_SIZE}, 1fr); background: #0a0a0a; height: 90dvh; max-height: 600px; aspect-ratio: 1;"
>
  {#each Array(BOARD_SIZE) as _, row}
    {#each Array(BOARD_SIZE) as _, col}
      {@const cell = board[row][col]}
      {@const won = isWinCell(row, col)}
      {@const winIdx = getWinIndex(row, col)}
      <button
        class="rounded-full flex items-center justify-center transition-all overflow-visible {!cell && canPlace ? 'cursor-pointer hover:bg-[var(--cell-hover)]' : 'cursor-default'} {won ? 'win-cell' : ''}"
        style="background: {cell ? 'transparent' : 'var(--cell)'}; border: 2px solid var(--gold); {won ? `--delay: ${winIdx * 300}ms; border-color: #fff8e0; border-width: 3px;` : cell ? '' : 'opacity: 0.6;'}"
        onclick={() => !cell && canPlace && onCellClick(row, col)}
        disabled={!!cell || !canPlace}
      >
        {#if cell}
          <Pieza piece={cell} size="lg" placed={true} />
        {/if}
      </button>
    {/each}
  {/each}
</div>

<style>
  .win-cell {
    animation: pulse-glow 0.8s ease-in-out infinite, appear 0.5s ease-out forwards;
    animation-delay: 0ms, var(--delay);
    animation-fill-mode: both;
  }

  @keyframes pulse-glow {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 12px var(--gold), 0 0 24px rgba(201,168,76,0.3);
    }
    50% {
      transform: scale(1.08);
      box-shadow: 0 0 20px var(--gold), 0 0 40px rgba(201,168,76,0.4);
    }
  }

  @keyframes appear {
    0% {
      border-color: var(--gold);
      border-width: 2px;
      box-shadow: none;
    }
    100% {
      border-color: #fff8e0;
      border-width: 3px;
      box-shadow: 0 0 12px var(--gold), 0 0 24px rgba(201,168,76,0.3);
    }
  }
</style>
