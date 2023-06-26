<template>
  <div>
    <q-row>
      <q-col>
        <q-btn
          @click="$router.push({ name: 'Home' })"
          icon="mdi-arrow-left"
          flat
          dense
        >
          Back
        </q-btn>
      </q-col>
    </q-row>
    <q-row class="mt-10" v-if="isLoading">
      <q-col cols="12" lg="6"> Loading... </q-col>
    </q-row>
    <q-row class="mt-10" v-if="country">
      <q-col cols="12" lg="6">
        <q-img
          :src="
            country?.cca3
              ? `https://restcountries.com/v3.1/flag/${country.cca3}.svg`
              : ''
          "
          alt="Flag"
          cover
        ></q-img>
      </q-col>
      <q-col cols="12" lg="6">
        <h2 class="mb-4">{{ country[0]?.name.common }}</h2>
        <div class="detail__container">
          <div class="detail__left">
            <p>
              <strong>Native Name:</strong> {{ country[0]?.name?.official }}
            </p>
            <p>
              <strong>Population:</strong>
              {{ country[0]?.population.toLocaleString() }}
            </p>
            <p><strong>Region:</strong> {{ country[0]?.region }}</p>
            <p><strong>Subregion:</strong> {{ country[0]?.subregion }}</p>
            <p><strong>Capital:</strong> {{ country[0]?.capital }}</p>
          </div>
          <div class="detail__right">
            <p><strong>Top Level Domain:</strong> {{ country[0]?.tld[0] }}</p>
            <p><strong>Currencies:</strong> {{ getCurrencies() }}</p>
            <p><strong>Languages:</strong> {{ getLanguages() }}</p>
          </div>
        </div>
        <div class="border-countries__container">
          <strong>Border Countries:</strong>
          <div
            v-if="country?.borders && country.borders.length === 0"
            class="no-border-countries"
          >
            No border countries
          </div>
          <div v-else class="border-countries">
            <template v-if="country?.borders && country.borders.length">
              <q-btn
                v-for="border in country.borders"
                :key="border"
                @click="goToBorderCountry(border)"
                class="border-country"
                label-class="border-country__label"
                dense
                outlined
                color="black"
                :icon-right="true"
                :loading="isLoading"
              >
                {{ getBorderCountryName(border) }}
              </q-btn>
            </template>
            <div v-else class="no-border-countries">No border countries</div>
          </div>
        </div>
      </q-col>
    </q-row>
  </div>
</template>

<script>
import { ref, defineComponent, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default defineComponent({
  name: "CardDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const country = ref(null);
    const isLoading = ref(false);
    const showModal = ref(false);
    const selectedCountry = ref(null);

    async function fetchCountryData() {
      isLoading.value = true;
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/alpha/${route.params.id}`
        );
        country.value = response.data;
      } catch (error) {
        console.error(error);
      }
      setTimeout(() => {
        isLoading.value = false;
      }, 5000);
    }

    function goToBorderCountry(border) {
      showModal.value = true;
      selectedCountry.value = border;
    }

    function getBorderCountryName(border) {
      if (country.value) {
        const borderCountry = country.value[0].borders.find(
          (b) => b.cca3 === border
        );
        return borderCountry?.name?.common;
      }
      return "";
    }

    function getCurrencies() {
      if (country.value && country.value[0].currencies) {
        const currencies = country.value[0].currencies;
        const currencyKeys = Object.keys(currencies);
        const currencyNames = currencyKeys.map((key) => currencies[key].name);
        console.log(currencyNames);
        return currencyNames.join(", ");
      }
      return "";
    }

    function getLanguages() {
      if (country.value && country.value[0].languages) {
        return Object.values(country.value[0].languages).join(", ");
      }
      return "";
    }

    onMounted(() => {
      fetchCountryData();
    });

    return {
      country,
      isLoading,
      showModal,
      selectedCountry,
      goToBorderCountry,
      getBorderCountryName,
      getCurrencies,
      getLanguages,
    };
  },
});
</script>

<style scoped>
.detail__container {
  display: flex;
  flex-direction: column;
}

.detail__left,
.detail__right {
  flex: 1;
}

.border-countries {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.border-country {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.border-country__label {
  padding-right: 8px;
}

.no-border-countries {
  margin-top: 10px;
}

@media (min-width: 1024px) {
  .detail__container {
    flex-direction: row;
  }

  .detail__left,
  .detail__right {
    margin-right: 20px;
  }
}
</style>
