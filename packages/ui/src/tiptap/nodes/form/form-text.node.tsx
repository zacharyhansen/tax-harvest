import type { TextNodeAttributes } from "./types";
import { Input } from "@repo/ui/components/input";

import InputField from "@repo/ui/form-builder/fields/input.field";

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { generateRandomFieldName } from "../../utils";

import { useFormKeyDown } from "./hooks/use-form-key-down";
import { InputWrapper } from "./input.wrapper";
import { FormNode } from "./types";

export const FormTextNode = Node.create<TextNodeAttributes>({
  name: FormNode.Text, // Unique name for your node
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
    };
  },

  parseHTML() {
    return [
      {
        tag: "form-text-node",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["form-text-node", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer((props) => {
      const { node, updateAttributes } = props;
      const { placeholder } = node.attrs as TextNodeAttributes;
      const { handleKeyDown } = useFormKeyDown(props);

      if (!props.editor.isEditable) {
        return <InputField {...(props.node.attrs as TextNodeAttributes)} />;
      }

      return (
        <InputWrapper {...props} type={FormNode.Text}>
          <Input
            placeholder="Type placeholder text"
            onChange={(event) => {
              updateAttributes({ placeholder: event.target.value });
            }}
            onKeyDown={handleKeyDown}
            value={placeholder}
            className="text-muted-foreground transition-all duration-200 placeholder:text-transparent focus:outline-none focus:placeholder:text-gray-400"
          />
        </InputWrapper>
      );
    });
  },
});
