export const visualizationStore = {
    namespaced: true,
    state() {
        return {
            nodes: [
                // {
                //   id: 'node1',
                //   label: 'Circle1',
                //   x: 150,
                //   y: 150,
                //     },
            ],
            edges: [

            ]
        }
    },
    mutations: {
        ADD_NODE(state, id) {
            state.nodes.push({
                id: id,
                label: id
            });
        },
        DELETE_NODE(state, id) {
            state.nodes = state.nodes.filter((node) => node.id !== id);
        }
    },
    actions: {
        addNode(context, id) {
            context.commit('ADD_NODE', id);
        },
        deleteNode(context, id) {
            context.commit('DELETE_NODE', id);
        },
    },
    getters: {
        nodes(state) {
            return state.nodes;
        },
        edges(state) {
            return state.edges;
        }
    }
}
