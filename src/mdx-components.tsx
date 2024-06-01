import type { MDXComponents } from "mdx/types";

const Hr = () => <hr className="h-0 border-1 border-slate-200/30" />;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <div className="flex flex-col gap-3 mb-2 mt-8">
        <h1 className="text-3xl font-semibold text-white" {...props} />
        <Hr />
      </div>
    ),
    p: (props) => <p className="text-base text-white/90" {...props} />,
    ...components,
  };
}
