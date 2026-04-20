import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'
import { JsonLd } from './components/JsonLd'
import { EuAiActCountdown } from './components/EuAiActCountdown'

const docsComponents = getDocsMDXComponents()

export function useMDXComponents(components) {
  return {
    ...docsComponents,
    JsonLd,
    EuAiActCountdown,
    ...components,
  }
}
