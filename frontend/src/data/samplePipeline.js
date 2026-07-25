export const samplePipelineJson = JSON.stringify(
  {
    graph: {
      nodes: {
        ast_0: {
          type: 'scan',
          data: {},
        },
        ast_1: {
          type: 'select',
          input: 'ast_0',
          exprs: [{ type: 'col', name: 'dato' }],
        },
      },
      outputs: ['ast_1'],
    },
  },
  null,
  2,
)
