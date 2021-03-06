// TODO(luis): remove this file, no longer being imported anywhere
import { GatsbyCache } from 'gatsby';
import {
  GraphQLFieldConfig,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'gatsby/graphql';
import type ImgixClient from 'imgix-core-js';
import * as R from 'ramda';
import { IImgixGatsbyRootArgs, IImgixParams } from '../../publicTypes';
import { createImgixFixedFieldConfig } from './createImgixFixedFieldConfig';
import { createImgixFluidFieldConfig } from './createImgixFluidFieldConfig';
import { createImgixUrlFieldConfig } from './createImgixUrlFieldConfig';

type IRootSource = {
  rawUrl: string;
};
export const createRootImgixImageType = (
  imgixClient: ImgixClient,
  cache: GatsbyCache,
  defaultParams: Partial<IImgixParams>,
): GraphQLFieldConfig<IRootSource, {}, IImgixGatsbyRootArgs> => ({
  args: {
    url: {
      type: GraphQLNonNull(GraphQLString),
      description:
        'The path of the image to render. If using a Web Proxy Source, this must be a fully-qualified URL.',
    },
  },
  type: new GraphQLObjectType({
    name: 'ImgixImage',
    fields: {
      url: createImgixUrlFieldConfig({
        imgixClient,
        resolveUrl: R.prop('rawUrl'),
        defaultParams,
      }),
      fluid: createImgixFluidFieldConfig({
        imgixClient,
        resolveUrl: R.prop('rawUrl'),
        cache,
        defaultParams,
      }) as GraphQLFieldConfig<IRootSource, {}, any>,
      fixed: createImgixFixedFieldConfig<IRootSource, unknown>({
        imgixClient,
        resolveUrl: R.prop('rawUrl'),
        cache,
        defaultParams,
      }) as GraphQLFieldConfig<IRootSource, {}, any>,
    },
  }),
  resolve(_: unknown, args: IImgixGatsbyRootArgs): IRootSource {
    return { rawUrl: args.url };
  },
});
