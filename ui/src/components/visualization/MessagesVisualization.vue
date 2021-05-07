<template>
  <div id="graph">
      content here
  </div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  name: "MessagesVisualization",
  data() {
    return {
      graph: new G6.Graph({
        container: 'graph',
        width: 500,
        height: 500,
        defaultNode: {
          type: 'circle',
          size: [10],
          color: '#5B8FF9',
          style: {
            fill: '#9EC9FF',
            lineWidth: 3,
          },
          labelCfg: {
            style: {
              fill: '#fff',
              fontSize: 20,
            },
          },
        },
        defaultEdge: {
          style: {
            stroke: '#e2e2e2',
          },
        },
      })

    }
  }
}
</script>

<style scoped>

</style>
