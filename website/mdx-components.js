import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { JsonLd } from './components/JsonLd'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components) {
  return {
    ...docsComponents,
    JsonLd,
    ...components,
  }
}
