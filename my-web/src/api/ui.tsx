// https://github.com/ory/kratos-selfservice-ui-node/blob/master/src/helpers/ui.ts
import { UiNode, UiNodeInputAttributes } from "@ory/kratos-client";
import {
  UiContainer,
  UiNodeAnchorAttributes,
  UiNodeTextAttributes,
  UiText,
} from "@ory/kratos-client/api";

import { Button, Input, Form } from "antd";
import { ValidateStatus } from "antd/lib/form/FormItem";
import { RuleType } from "rc-field-form/lib/interface";

const translations: { [key: string]: { title: string } } = {
  // You could add custom translations here if you want to:
  //
  // 'traits.email': {
  //   title: 'E-Mail',
  // },
};

type Translations = typeof translations;

const getTitle = (n: UiNode): string => {
  switch (n.type) {
    case "a":
      return (n.attributes as UiNodeAnchorAttributes).title.text;
    case "img":
      return n.meta.label?.text || "";
    case "input":
      const key = (n.attributes as UiNodeInputAttributes).name;
      if (n.meta?.label?.text) {
        return n.meta.label.text;
      } else if (key in translations) {
        return translations[key as keyof Translations].title;
      }
      return key;
    case "text":
      return (n.attributes as UiNodeTextAttributes).text.text;
  }
  return "";
};

export const toUiNodeAntd = (node: UiNode) => {
  switch (node.type) {
    case "input": {
      const title = getTitle(node);
      const attrs = node.attributes as UiNodeInputAttributes;

      const messages = node.messages as Array<UiText>;
      const message = messages ? messages[0] : null;

      switch (attrs.type) {
        case "hidden":
          return (
            <Form.Item name={attrs.name} initialValue={attrs.value} hidden>
              <Input type="hidden" />
            </Form.Item>
          );
        case "password":
          return (
            <Form.Item
              name={attrs.name}
              initialValue={attrs.value}
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 chars long!" },
              ]}
              validateStatus={message?.type as ValidateStatus}
              help={message?.text}
              hasFeedback
            >
              <Input.Password
                type={attrs.type}
                placeholder={title}
                disabled={attrs.disabled}
              />
            </Form.Item>
          );
        case "submit":
          return (
            <Form.Item name={attrs.name} initialValue={attrs.value}>
              <Button
                type="primary"
                htmlType={attrs.type}
                disabled={attrs.disabled}
                block
              >
                Sign up
              </Button>
            </Form.Item>
          );
        default:
          let rules;
          if (attrs.type === "email") {
            rules = [
              { required: true, message: "Please input your email!" },
              {
                type: "email" as RuleType,
                message: "The input is not valid email!",
              },
            ];
          } else if (attrs.name === "traits.username") {
            rules = [
              { required: true, message: "Please input your username!" },
              {
                pattern: RegExp(attrs.pattern!),
                message:
                  "Username must be between 3~20 chars (letters, digits, _), _ can not be the beginning.!",
              },
            ];
          }
          return (
            <Form.Item
              name={attrs.name}
              initialValue={attrs.value}
              rules={rules}
              validateStatus={message?.type as ValidateStatus}
              help={message?.text}
              hasFeedback
            >
              <Input
                type={attrs.type}
                placeholder={title}
                disabled={attrs.disabled}
              />
            </Form.Item>
          );
      }
    }
  }
  return null;
};

export const submitViaForm = (ui: UiContainer, values: any): void => {
  const form = document.createElement("form");
  form.action = ui.action;
  form.method = ui.method;
  form.hidden = true;
  for (const [k, v] of Object.entries(values)) {
    const input = document.createElement("input");
    input.type = "text";
    input.name = k;
    input.value = v as string;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
