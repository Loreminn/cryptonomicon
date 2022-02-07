<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="ticker"
            @keydown.enter="add"
            @input="onInputTicker"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div
          v-if="tickerClues.length > 0"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="clue in tickerClues"
            :key="clue.Id"
            @click="addFromClue(clue)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ clue.Symbol }}
          </span>
        </div>
        <div v-if="isAdded" class="text-sm text-red-600">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button @click="add" type="button" class="my-4" />
  </section>
</template>

<script>
import AddButton from "./AddButton.vue";

export default {
  components: { AddButton },

  data() {
    return {
      ticker: "",
    };
  },

  props: {
    allTickers: {
      type: Object,
      required: true,
      default() {
        return {};
      },
    },
    isAdded: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  methods: {
    add() {
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },
    onInputTicker() {
      this.$emit("input-ticker");
    },
  },

  computed: {
    tickerClues() {
      if (this.ticker) {
        const clues = this.allTickers.filter(
          (t) =>
            t.FullName.toLowerCase().includes(this.ticker.toLowerCase()) &&
            t.Symbol.toLowerCase().includes(this.ticker.toLowerCase())
        );
        return clues.slice(0, 4);
      }
      return [];
    },
  },
};
</script>
