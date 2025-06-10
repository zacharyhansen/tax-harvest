import type { ComboboxNodeAttributes } from "./types";
import { Input } from "@repo/ui/components/input";

import ComboboxField from "@repo/ui/form-builder/fields/combobox.field";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { generateRandomFieldName } from "../../utils";

import { useFormKeyDown } from "./hooks/use-form-key-down";
import { InputWrapper } from "./input.wrapper";
import { FormNode } from "./types";

export const FormComboboxNode = Node.create<ComboboxNodeAttributes>({
  name: FormNode.Combobox, // Unique name for your node
  group: "block", // Allow it to act like a block element
  atom: true, // Treat as a single unit (atomic)

  addAttributes() {
    return {
      name: { default: generateRandomFieldName("field", 10) },
      label: { default: "" },
      defaultValue: { default: "" },
      placeholder: { default: "" },
      required: { default: true },
      description: { default: "" },
      nameLocked: { default: false },
      options: {
        default: [],
        parseHTML: (element) => {
          const json = element.dataset.options;
          try {
            return json ? JSON.parse(json) : [];
          } catch (error) {
            console.error("Failed to parse options JSON:", error);
            return [];
          }
        },
        renderHTML: (attributes) => {
          if (!attributes.options || !Array.isArray(attributes.options)) {
            return {};
          }
          return {
            "data-options": JSON.stringify(attributes.options),
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "form-combobox-node",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["form-combobox-node", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer((props) => {
      const { node, updateAttributes, editor } = props;
      const { placeholder } = node.attrs as ComboboxNodeAttributes;
      const { handleKeyDown } = useFormKeyDown(props);

      if (!editor.isEditable) {
        return (
          <ComboboxField {...(props.node.attrs as ComboboxNodeAttributes)} />
        );
      }

      return (
        <InputWrapper {...props} type={FormNode.Combobox}>
          <Input
            placeholder="Type placeholder text"
            onChange={(event) => {
              updateAttributes({ placeholder: event.target.value });
            }}
            onKeyDown={handleKeyDown}
            value={placeholder}
            className="text-muted-foreground transition-all duration-200 placeholder:text-transparent focus:outline-hidden focus:placeholder:text-gray-400"
          />
        </InputWrapper>
      );
    });
  },
});
