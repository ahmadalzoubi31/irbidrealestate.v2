export const useBuildingStore = defineStore("building", {
  state: () => ({
    buildings: [],
    loading: false,
  }),
  getters: {
    getBuildingById: (state) => {
      return (id) => {
        return state.buildings.find((building) => building.id == id);
      };
    },
  },
  actions: {
    async fetchBuildings() {
      this.loading = true;

      try {
        const { data, refresh, status, error } = await useAsyncData("getBuildings", () => $fetch("/api/buildings"));
        if (status.value === "success") {
          this.buildings = data.value;
        } else {
          throw error.value;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchBuildingById(id) {
      this.loading = true;
      this.error = null;

      try {
        const data = this.buildings.find((b) => b.id === id);
        if (!data) return [];

        return data.value;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createBuilding(payload) {
      this.loading = true;

      try {
        const { data, refresh, status, error } = await useAsyncData("createBuilding", () =>
          $fetch("/api/buildings", {
            method: "post",
            body: payload,
          })
        );

        if (status.value === "success") {
          this.buildings.push(data.value);
          await navigateTo("/buildings");
        } else {
          throw error.value;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        await this.fetchBuildings();
      }
    },

    async editBuilding(id, payload) {
      this.loading = true;

      try {
        const building = this.getBuildingById(id);
        if (!building) {
          throw new Error("no building related to this id");
        }

        const { data, refresh, status, error } = await useAsyncData("editBuilding", () =>
          $fetch("/api/buildings/" + id, {
            method: "put",
            body: payload,
          })
        );
        if (status.value === "success") {
          this.buildings = this.buildings.map((el) => (el.id == id ? data.value : el));
          await navigateTo("/buildings");
        } else {
          throw error.value;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
        // await this.fetchBuildings();
      }
    },

    async deleteBuilding(id) {
      this.loading = true;

      try {
        const building = this.getBuildingById(id);
        if (!building) {
          throw new Error("no building related to this id");
        }

        const { data, refresh, status, error } = await useAsyncData("deleteBuilding", () =>
          $fetch("/api/buildings/" + id, {
            method: "delete",
          })
        );
        if (status.value === "success") {
          this.fetchBuildings();
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
