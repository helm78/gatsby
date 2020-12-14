import { CreateSchemaCustomizationArgs, GatsbyNode, PluginOptions } from 'gatsby';
import { invariant } from '../../common/utils';
import { IGatsbySourceUrlOptions } from '../gatsby-source-url/publicTypes';

export const onCreateNode: GatsbyNode['onCreateNode'] = async (
  gatsbyContext,
  pluginOptions: PluginOptions<IGatsbySourceUrlOptions>,
) => {
  const { node, actions, reporter } = gatsbyContext;
  const { createNodeField } = actions;

  const { domain, secureUrlToken, sourceType, fields = [] } = pluginOptions;
  invariant(
    Array.isArray(fields),
    'fields must be an array of field options',
    reporter,
  );

  const fieldOptions = fields.filter(
    (fieldOptions) => fieldOptions.nodeType === node.internal.type,
  );
  if (fieldOptions.length < 1) return;

  for (const field of fieldOptions) {
    let fieldValue = undefined as string | string[] | undefined;

    if ('getUrl' in field) {
      fieldValue = field.getUrl(node);
      invariant(
        fieldValue === undefined ||
          fieldValue === null ||
          typeof fieldValue === 'string',
        'getUrl must return a URL string',
        reporter,
      );
    } else if ('getUrls' in field) {
      fieldValue = field.getUrls(node);
      invariant(
        Array.isArray(fieldValue),
        'getUrls must return an array of URLs',
        reporter,
      );
    }

    if (!fieldValue) continue;

    if (sourceType === ImgixSourceType.WebProxy) {
      invariant(
        domain !== undefined,
        'an Imgix domain must be provided if sourceType is webProxy',
        reporter,
      );
      invariant(
        secureUrlToken !== undefined,
        'a secure URL token must be provided if sourceType is webProxy',
        reporter,
      );

      if (Array.isArray(fieldValue))
        fieldValue = fieldValue.map((url) =>
          transformUrlForWebProxy(url, domain),
        );
      else fieldValue = transformUrlForWebProxy(fieldValue, domain);
    }

    createNodeField({ node, name: field.fieldName, value: fieldValue });
  }
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async (
  gatsbyContext: CreateSchemaCustomizationArgs,
  pluginOptions: PluginOptions<IGatsbySourceUrlOptions>,,
) => {
  const { actions, cache, schema, reporter } = gatsbyContext;
  const { createTypes } = actions;

  const {
    secureUrlToken,
    sourceType,
    namespace,
    defaultImgixParams,
    defaultPlaceholderImgixParams,
    fields = [],
  } = pluginOptions;
  invariant(
    Array.isArray(fields),
    'fields must be an array of field options',
    reporter,
  );
  invariant(
    sourceType !== ImgixSourceType.WebProxy || Boolean(secureUrlToken),
    'a secure URL token must be provided if sourceType is webProxy',
    reporter,
  );

  const ImgixFixedType = createImgixFixedType({
    name: ns(namespace, 'ImgixFixed'),
    cache,
  });

  const ImgixFluidType = createImgixFluidType({
    name: ns(namespace, 'ImgixFluid'),
    cache,
  });

  const ImgixImageType = schema.buildObjectType({
    name: ns(namespace, 'ImgixImage'),
    fields: {
      url: createImgixUrlSchemaFieldConfig({
        resolveUrl: (url: string) => url,
        secureUrlToken,
        defaultImgixParams,
      }),
      fixed: createImgixFixedSchemaFieldConfig({
        type: ImgixFixedType,
        resolveUrl: (url: string) => url,
        secureUrlToken,
        defaultImgixParams,
        defaultPlaceholderImgixParams,
        cache,
      }),
      fluid: createImgixFluidSchemaFieldConfig({
        type: ImgixFluidType,
        resolveUrl: (url: string) => url,
        secureUrlToken: secureUrlToken,
        defaultImgixParams,
        defaultPlaceholderImgixParams,
        cache,
      }),
    },
  });

  const fieldTypes = fields.map((fieldOptions) =>
    schema.buildObjectType({
      name: `${fieldOptions.nodeType}Fields`,
      fields: {
        [fieldOptions.fieldName]: {
          type:
            'getUrls' in fieldOptions
              ? `[${ImgixImageType.config.name}]`
              : ImgixImageType.config.name,
        },
      },
    }),
  );

  // createTypes([ImgixFixedType, ImgixFluidType]);
  // createTypes(ImgixImageType);
  createTypes(fieldTypes);
};