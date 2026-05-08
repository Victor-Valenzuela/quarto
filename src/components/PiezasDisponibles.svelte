<script>
  import { generatePieces } from '../lib/gameLogic.js';
  import Pieza from './Pieza.svelte';

  let { pieces, selectedPiece, canSelect, onSelect } = $props();

  const allPieces = generatePieces();
  const lightAll = allPieces.filter(p => !p.dark);
  const darkAll = allPieces.filter(p => p.dark);

  function isAvailable(piece) {
    return pieces.some(p => p.id === piece.id);
  }
</script>

<div class="flex flex-col gap-3 lg:gap-x-10 lg:gap-y-10">
  <!-- Claras -->
  <div class="grid grid-cols-4 gap-4 lg:gap-x-25 lg:gap-y-10 justify-items-center items-center">
    {#each lightAll as piece}
      <div class={isAvailable(piece) ? '' : 'invisible'}>
        <Pieza
          {piece}
          size="sm"
          selected={selectedPiece && selectedPiece.id === piece.id}
          disabled={!canSelect || !isAvailable(piece)}
          onclick={() => canSelect && isAvailable(piece) && onSelect(piece)}
        />
      </div>
    {/each}
  </div>

  <!-- Oscuras -->
  <div class="grid grid-cols-4 gap-4 lg:gap-x-25 lg:gap-y-10 justify-items-center items-center">
    {#each darkAll as piece}
      <div class={isAvailable(piece) ? '' : 'invisible'}>
        <Pieza
          {piece}
          size="sm"
          selected={selectedPiece && selectedPiece.id === piece.id}
          disabled={!canSelect || !isAvailable(piece)}
          onclick={() => canSelect && isAvailable(piece) && onSelect(piece)}
        />
      </div>
    {/each}
  </div>
</div>
