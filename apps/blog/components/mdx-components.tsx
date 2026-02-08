import type { MDXComponents } from "mdx/types";
import { LinkCard } from "@/components/link-card";

export const mdxComponents: MDXComponents = {
  LinkCard,
  h1: (props) => (
    <h1
      className="group text-3xl font-bold mt-12 mb-4 [&>a]:no-underline"
      {...props}
    >
      <span className="transition-opacity mr-2 text-primary">#</span>
      {props.children}
    </h1>
  ),
  h2: (props) => <h2 className="text-2xl font-semibold mt-8 mb-3" {...props} />,
  h3: (props) => (
    <h3
      className="text-xl font-semibold mt-6 mb-2 [&>a]:no-underline"
      {...props}
    />
  ),
  p: (props) => <p className="leading-7 mb-4" {...props} />,
  a: (props) => {
    const isHeadingLink = props.href?.startsWith("#");
    return (
      <a
        className={
          isHeadingLink
            ? "underline underline-offset-4 text-inherit"
            : "text-emerald-500 no-underline hover:underline underline-offset-4 font-normal"
        }
        target={props.href?.startsWith("http") ? "_blank" : undefined}
        rel={
          props.href?.startsWith("http") ? "noopener noreferrer" : undefined
        }
        {...props}
      />
    );
  },
  ul: (props) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-lg my-4" alt={props.alt || ""} {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-border px-4 py-2 text-left font-semibold bg-muted"
      {...props}
    />
  ),
  td: (props) => <td className="border border-border px-4 py-2" {...props} />,
};
