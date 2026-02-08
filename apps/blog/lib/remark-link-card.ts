import { visit } from "unist-util-visit";

export function remarkLinkCard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (index == null || !parent) return;
      if (node.children.length === 1 && node.children[0].type === "link") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const link = node.children[0] as any;
        if (!link.url?.startsWith("http")) return;

        const title = link.children
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((c: any) => c.type === "text")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((c: any) => c.value)
          .join("");

        parent.children[index] = {
          type: "mdxJsxFlowElement",
          name: "LinkCard",
          attributes: [
            { type: "mdxJsxAttribute", name: "url", value: link.url },
            { type: "mdxJsxAttribute", name: "title", value: title },
          ],
          children: [],
          data: { _mdxExplicitJsx: true },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      }
    });
  };
}
