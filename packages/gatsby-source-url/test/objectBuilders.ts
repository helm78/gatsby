import { __calculateFluidDimensions } from '../src/objectBuilders';
describe('__calculateFluidDimensions', () => {
  const TEST_CASES: [name: string, args: [maxWidth: number | undefined, maxHeight: number | undefined, sourceWidth: number, sourceHeight: number, aspectRatio: number | undefined], result: [maxWidth: number, maxHeight: number, presentationWidth: number, presentationHeight: number]][] = [
    ['basic case', [10, 10, 1000, 1000, undefined], [10, 10, 10, 10]],
    ['no max dimensions', [undefined, undefined, 1000, 1000, undefined], [1000, 1000, 1000, 1000]],
    ['no max dimesions w/ aspect ratio', [undefined, undefined, 1000, 1000, 2], [1000, 500, 1000, 500]],
    ['maxWidth & aspectRatio', [500, undefined, 1000, 1000, 2], [500, 250, 1000, 500]],
    ['maxHeight & aspectRatio, (w/ default maxWidth)', [undefined, 500, 1000, 1000, 2], [500, 250, 1000, 500]],
    ['aspect ratio should override max width and height', [10, 20, 1000, 1000, 2], [10, 5, 10, 5]],
    ['when max width is larger than source width, max width should be original max width, but presentation width should be source width', [1000, 1000, 100, 1500, undefined], [1000, 1000, 100, 100]],
    ['when max height is larger than source height, max height should be original max height, but presentation height should be source height', [1000, 1000, 1500, 200, undefined], [1000, 1000, 200, 200]],
    ['when max dimenions larger than source and aspect ratio set', [1000, 200, 800, 1000, 2], [1000, 500, 800, 400]]
  ];

    TEST_CASES.map(
      ([name, args, result]) => {
        it(name, () => {
          const { maxWidth, aspectRatio, presentationWidth, presentationHeight } = __calculateFluidDimensions({
            maxWidth: args[0],
            maxHeight: args[1],
            sourceWidth: args[2],
            sourceHeight: args[3],
            aspectRatio: args[4],
          })

          expect(maxWidth).toBe(result[0])
          expect(aspectRatio).toBe(result[1])
          expect(presentationWidth).toBe(result[2])
          expect(presentationHeight).toBe(result[3])
        })
    }
  )


});