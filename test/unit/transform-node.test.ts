import { Node } from "gatsby";
import { onCreateNode } from "../../src/gatsby-node";

describe('transform-node', () => {
  test('should add a correct imgix field to a specified node', () => {
    const result = testOnCreateNode({
      appConfig: {
        fields: [
          {
            nodeType: 'TestNode',
            getUrl: (node) => node.imageUrl,
          },
        ],
      },
      nodeTypName: 'TestNode',
      nodeData: { imageUrl: 'https://assets.imgix.net/amsterdam.jpg' },
      field: 'imgixImage',
      subField: 'url',
    });

    expect(result.nodeTypes.TestNode.imgixImage.url).toMatch('ixlib=');
  });
  test('should allow imgix field to be customised');
  test('should add imgix fields to multiple nodes');
  test('should error when sourceType is not webproxy');
  test('should error when secureURLToken is not set');
  test('should error when fields.nodeType is not set');
  test('should error when fields.getURL is not set');
});

const resolveNodeField = async ({
  appConfig,
  nodeTypeName,
  nodeData,
  field,
  subField
  subFieldParams = {},
}: {
  appConfig?: Parameters<typeof resolveNodeFieldInternal>[0]['appConfig'];
  nodeTypeName: string;
    nodeData: Record<any, any>;
  field: string,
  subField: 'url' | 'fluid' | 'fixed';
  subFieldParams?: Object;
}) => {
  /* This is pretty convoluted test but I think it's better to test the whole thing e2e than just test the individual components and hope for the best.

  This test is equivalent to running a graphql query of
  {
    imgixImage(url: $url) {
      url(imgixParams: fieldParams.imgixParams)
    }
  }
  and asserting that the url field matches "test.imgix.net/image.jpg/"
  */

  // Call createResolvers and capture the result
  const resolveResult = await resolveNodeFieldInternal({
    appConfig,
    nodeTypeName,
    nodeData,
    field,
    subField,
    subFieldParams,
  });

  return resolveResult.fieldResult;
};

type FieldParams = Record<string, any>;

jest.mock
async function resolveNodeFieldInternal({
  appConfig,
  nodeTypeName,
  nodeData,
  field,
  subField,
  subFieldParams = {},
}: {
  appConfig?: Parameters<typeof createRootResolversMap>[0];
  nodeTypeName: string;
  nodeData: Record<any, any>;
  field: string,
  subField: 'url' | 'fluid' | 'fixed';
  subFieldParams?: Object;
}) {

  const mockCreateNodeFieldFunction = jest.fn();

  onCreateNode && onCreateNode(
    { 
      node,
      actions,
      reporter
    },
    { createNodeField: mockCreateNodeFieldFunction }
  )

  const nodeField: { node: Node, name: string, value: string | string[] | undefined }= mockCreateNodeFieldFunction.mock.calls[0][0]






  // const resolverMap = await createRootResolversMap(appConfig);

  // const fieldParamsWithDefaults = createFieldParamsWithDefaults(
  //   resolverMap,
  //   field,
  //   fieldParams,
  // );

  // // Get root value from the root imgixImage resolver. This is passed to child resolvers.
  // const imgixImageRootValue = resolverMap.Query.imgixImage.resolve({}, { url });

  // // Resolve the field specified in the imgixImage type
  // const fieldResult = await resolverMap.Query.imgixImage.type
  //   .getFields()
  //   [field].resolve(imgixImageRootValue, fieldParamsWithDefaults);
  // return { fieldResult, resolverMap };
}


function createFieldParamsWithDefaults(
  resolverMap: any,
  field: 'url' | 'fluid' | 'fixed',
  fieldParams: FieldParams,
) {
  const defaultParamsForField = pipe(
    R.chain(
      (v: any): [string, any][] =>
        v.defaultValue ? [[v.name, v.defaultValue]] : [],
      resolverMap.Query.imgixImage.type.getFields()[field].args ?? [],
    ),
    (v) => R.fromPairs(v),
  );
  return {
    ...defaultParamsForField,
    ...fieldParams,
  };
}
