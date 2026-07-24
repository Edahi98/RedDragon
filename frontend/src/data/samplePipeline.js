export const samplePipelineJson = JSON.stringify(
  {
    graph: {
      nodes: {
        ast_0: {
          type: 'scan',
          data: {},
        },
        ast_1: {
          type: 'filter',
          input: 'ast_0',
          predicate: {
            type: 'binary',
            op: '>',
            left: { type: 'col', name: 'revenue' },
            right: { type: 'lit', value: 100, dtype: null },
          },
        },
      },
      outputs: ['ast_1'],
    },
  },
  null,
  2,
)
