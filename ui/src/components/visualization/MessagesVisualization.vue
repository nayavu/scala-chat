<template>
  <div id="graph">
  </div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  name: "MessagesVisualization",
  data() {
    return {
      graph: null
    }
  },
  computed: {
    nodes() {
      return this.$store.getters['visualization/nodes'];
    },
    edges() {
      return this.$store.getters['visualization/edges'];
    }
  },
  methods: {
    redrawGraph() {
      this.graph.data({
        nodes: this.nodes,
        edges: this.edges
      });
      this.graph.render();
    }
  },
  watch: {
    nodes() {
      this.redrawGraph();
    },
    edges() {
      this.redrawGraph();
    }
  },
  mounted() {
    this.graph = new G6.Graph({
      container: 'graph',
      width: 500,
      height: 500,
      fitView: true,

      layout: {
        type: 'circular',
        center: [0, 0], // The center of the graph by default
        radius: 250,
        angleRatio: 1,
      },
    });
    this.redrawGraph();
  },

  unmounted() {
    this.graph = null;
  }
}
</script>

<style scoped>
#graph {
  width: 500px;
  height: 500px;
  padding-top: 50px;
  margin: 0 auto;
}
</style>
