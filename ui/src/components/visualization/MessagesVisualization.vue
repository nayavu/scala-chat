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

      layout: {
        type: 'force',
        center: [200, 200], // The center of the graph by default
        linkDistance: 200, // Edge length
        nodeSize: 30,
        nodeStrength: 30,
        edgeStrength: 0.1,
        forceSimulation: null,
      }
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
  width: 50%;
  padding-top: 10%;
  margin: 0 auto;
}
</style>
