<script>
  import Pieza from './Pieza.svelte';

  let { pieces, selectedPiece, canSelect, onSelect } = $props();

  const lightPieces = $derived(pieces.filter(p => !p.dark));
  const darkPieces = $derived(pieces.filter(p => p.dark));
</script>

<div class="flex flex-col gap-3">
  <!-- Claras -->
  {#if lightPieces.length > 0}
    <div class="grid grid-cols-4 gap-3 justify-items-center items-center">
      {#each lightPieces as piece}
        <Pieza
          {piece}
          size="sm"
          selected={selectedPiece && selectedPiece.id === piece.id}
          disabled={!canSelect}
          onclick={() => canSelect && onSelect(piece)}
        />
      {/each}
    </div>
  {/if}

  <!-- Oscuras -->
  {#if darkPieces.length > 0}
    <div class="grid grid-cols-4 gap-3 justify-items-center items-center">
      {#each darkPieces as piece}
        <Pieza
          {piece}
          size="sm"
          selected={selectedPiece && selectedPiece.id === piece.id}
          disabled={!canSelect}
          onclick={() => canSelect && onSelect(piece)}
        />
      {/each}
    </div>
  {/if}
</div>
