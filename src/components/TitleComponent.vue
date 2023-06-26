<template>
  <div>
    <header class="tool__title">
      <q-toolbar-title style="color: white" class="font-weight-bold"
        >Where in the World?</q-toolbar-title
      >
    </header>
    <q-separator vertical inset class="custom-separator" />
    <div class="separator-container">
      <div class="search-container">
        <div class="search-wrapper">
          <q-input
            dense
            outlined
            placeholder="Search for a country..."
            clearable
            v-model="search"
            prepend-icon="mdi-magnify"
            class="search-input"
          />
        </div>
        <div class="dropdown-wrapper">
          <q-btn-dropdown label="Filter by region" class="dropdown-button">
            <q-list>
              <q-item clickable v-close-popup @click="onItemClick('Africa')">
                <q-item-section>
                  <q-item-label>Africa</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onItemClick('America')">
                <q-item-section>
                  <q-item-label>America</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onItemClick('Asia')">
                <q-item-section>
                  <q-item-label>Asia</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onItemClick('Europe')">
                <q-item-section>
                  <q-item-label>Europe</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onItemClick('Oceania')">
                <q-item-section>
                  <q-item-label>Oceania</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="showAllCountries">
                <q-item-section>
                  <q-item-label>ALL</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
    </div>
    <q-separator vertical inset class="custom-separator" />
    <q-row class="country-row">
      <q-col
        v-for="country in filteredCountries"
        :key="country.cca3"
        cols="12"
        md="4"
        class="mb-10"
      >
        <CountryCard :country="country" />
      </q-col>
    </q-row>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import CountryCard from "./CountryCard.vue";

export default defineComponent({
  name: "Home",
  components: {
    CountryCard,
  },
  setup() {
    const search = ref("");
    const countries = ref([]);
    const allCountries = ref([]);
    const selectedRegion = ref("");

    const filteredCountries = computed(() => {
      if (selectedRegion.value === "ALL") {
        return countries.value.filter((country) =>
          country.name.common.toLowerCase().includes(search.value.toLowerCase())
        );
      } else {
        return countries.value.filter(
          (country) =>
            country.region.toLowerCase().includes(selectedRegion.value.toLowerCase()) &&
            country.name.common.toLowerCase().includes(search.value.toLowerCase())
        );
      }
    });

    async function fetchCountries() {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        allCountries.value = response.data;
        countries.value = allCountries.value;
      } catch (error) {
        console.error(error);
      }
    }

    function onItemClick(region) {
      search.value = "";
      selectedRegion.value = region;
    }

    function showAllCountries() {
      search.value = "";
      selectedRegion.value = "ALL";
    }

    watch(search, () => {
      if (search.value === "") {
        fetchCountries();
      }
    });

    onMounted(() => {
      fetchCountries();
    });

    return {
      search,
      filteredCountries,
      onItemClick,
      showAllCountries,
    };
  },
});
</script>

<style scoped>
.tool__title {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2b3845;
}

.custom-separator {
  background-color: #2b3845;
}

.separator-container {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #2b3845;
}

.search-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.search-wrapper {
  flex-grow: 1;
  margin-right: 10px;
}

.dropdown-wrapper {
  flex-shrink: 0;
}

.search-input {
  max-width: 300px;
}

.dropdown-button {
  color: white;
}

.mb-10 {
  margin-bottom: 10px;
}

.country-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media (max-width: 960px) {
  .country-row {
    justify-content: center;
  }
}
</style>
