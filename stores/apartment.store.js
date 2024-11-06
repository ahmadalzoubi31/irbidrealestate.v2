export const useApartmentStore = defineStore("apartment", {
  state: () => ({
    apartments: [],
    loading: false,
  }),
  getters: {
    getApartmentById: (state) => {
      return (id) => {
        return state.apartments.find((apartment) => apartment.id == id);
      };
    },
  },
  actions: {
    async fetchApartments() {
      this.loading = true;

      try {
        const { data, refresh, status, error } = await useLazyAsyncData("getApartments", () => $fetch("/api/apartments"));
        if (status.value === "success") {
          this.apartments = data.value;
        } else {
          throw error.value;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    // async fetchApartmentById(id) {
    //   this.loading = true;
    //   this.error = null;

    //   try {
    //     const data = this.apartments.find((b) => b.id === id);
    //     if (!data) return [];

    //     return data.value;
    //   } catch (error) {
    //     this.error = error.message;
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async createApartment(payload) {
      this.loading = true;

      try {
        const { data, refresh, status, error } = await useLazyAsyncData("createApartment", () =>
          $fetch("/api/apartments", {
            method: "post",
            body: payload,
          })
        );

        if (status.value === "success") {
          this.apartments.push(data.value);
          await navigateTo("/apartments");
        } else {
          throw error.value;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        await this.fetchApartments();
      }
    },

    async editApartment(id, payload) {
      this.loading = true;

      try {
        const apartment = this.getApartmentById(id);
        if (!apartment) {
          throw new Error("no apartment related to this id");
        }

        const { data, refresh, status, error } = await useLazyAsyncData("editApartment", () =>
          $fetch("/api/apartments/" + id, {
            method: "put",
            body: payload,
          })
        );
        if (status.value === "success") {
          this.apartments = this.apartments.map((el) => (el.id == id ? data.value : el));
          await navigateTo("/apartments");
        } else {
          throw error.value;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        // await this.fetchApartments();
      }
    },

    async deleteApartment(id) {
      this.loading = true;

      try {
        const apartment = this.getApartmentById(id);
        if (!apartment) {
          throw new Error("no apartment related to this id");
        }

        const { data, refresh, status, error } = await useLazyAsyncData("deleteApartment", () =>
          $fetch("/api/apartments/" + id, {
            method: "delete",
          })
        );
        if (status.value === "success") {
          this.fetchApartments();
        } else {
          throw error.value;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
