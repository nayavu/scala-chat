export const visualizationStore = {
    namespaced: true,
    state() {
        return {
            nodes: [
                // {
                //   id: 'node1',
                //   label: 'Circle1',
                // },
            ],
            edges: []
        }
    },
    mutations: {
        SET_NODES(state, payload) {
            state.nodes = payload.map((id) => {
                return {
                    id: id,
                    // label: id
                }
            });
        },
        ADD_NODE(state, id) {
            state.nodes = [...state.nodes, {
                id: id,
                // label: id
            }];
        },

        DELETE_NODE(state, id) {
            state.nodes = state.nodes.filter((node) => node.id !== id);
        },

        ADD_EDGE(state, { senderId, recipientId }) {
            state.edges = [...state.edges, {
                source: senderId,
                target: recipientId
            }];
        },

        DELETE_EDGE(state, { senderId, recipientId }) {
            state.edges = state.edges
                .filter(({source, target}) => {
                    return source !== senderId && source !== recipientId
                        || target !== recipientId && target !== recipientId;
                });
        },

    },
    actions: {
        setNodes(context, payload) {
            context.commit('SET_NODES', payload);
        },
        addNode(context, id) {
            context.commit('ADD_NODE', id);
        },
        deleteNode(context, id) {
            context.commit('DELETE_NODE', id);
        },

        addEdge(context, payload) {
            context.commit('ADD_EDGE', payload);
        },
        deleteEdge(context, payload) {
            context.commit('DELETE_EDGE', payload);
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
