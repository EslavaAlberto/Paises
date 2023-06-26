<template>
  <router-link :to="{ name: 'detalle', params: { id: country.cca3 } }">
    <q-card class="card__custom" link hover outlined>
      <img :src="flagUrl" :alt="`Flag of ${country.name}`" class="card-image" />
      <q-card-section class="card-section" v-if="isLoading">
        Loading...
      </q-card-section>
      <q-card-section class="card-section" v-else-if="country">
        <p>
          <strong>Population:</strong> {{ country.population.toLocaleString() }}
        </p>
        <p><strong>Region:</strong> {{ country.region }}</p>
        <p><strong>Capital:</strong> {{ country.capital }}</p>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  name: "CountryCard",
  props: {
    country: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const flagUrl = ref("");
    const isLoading = ref(false);

    onMounted(() => {
      getFlag();
    });

    const getFlag = () => {
      const countryCode = props.country.cca3;
      const apiUrl = `https://restcountries.com/v2/alpha/${countryCode}`;

      isLoading.value = true;

      axios
        .get(apiUrl)
        .then((response) => {
          flagUrl.value = response.data.flags.png;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    return {
      flagUrl,
      isLoading,
      getFlag,
    };
  },
};
</script>

<style scoped>
.card__custom {
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-section {
  flex-grow: 1;
}
</style>
