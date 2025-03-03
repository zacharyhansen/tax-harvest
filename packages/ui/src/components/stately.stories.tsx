import type { Meta, StoryObj } from '@storybook/react';
import { assign, setup } from 'xstate';
import { useMachine } from '@xstate/react';
import { createBrowserInspector } from '@statelyai/inspect';

import { Stately } from './stately';
import { Button } from './button';
import { Textarea } from './textarea';

const { inspect } = createBrowserInspector({
  // Comment out the line below to prevent the inspector from opening every refresh
  // autoStart: false
});

const meta = {
  title: 'Atoms/Stately',
  component: Stately,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // xstate: true,
  },
  args: {
    onChange: () => {},
  },
  render: () => {
    const [state, send] = useMachine(feedbackMachine, {
      inspect,
    });

    if (state.matches('closed')) {
      return (
        <div>
          <em>Feedback form closed.</em>
          <br />
          <Button
            onClick={() => {
              send({ type: 'restart' });
            }}
          >
            Provide more feedback
          </Button>
        </div>
      );
    }

    return (
      <div className="feedback">
        <Button
          className="close-button"
          onClick={() => {
            send({ type: 'close' });
          }}
        >
          Close
        </Button>
        {state.matches('prompt') && (
          <div className="step">
            <h2>How was your experience?</h2>
            <Button
              className="button"
              onClick={() => {
                send({ type: 'feedback.good' });
              }}
            >
              Good
            </Button>
            <Button
              className="button"
              onClick={() => {
                send({ type: 'feedback.bad' });
              }}
            >
              Bad
            </Button>
          </div>
        )}

        {state.matches('thanks') && (
          <div className="step">
            <h2>Thanks for your feedback.</h2>
            {state.context.feedback.length > 0 && (
              <p>"{state.context.feedback}"</p>
            )}
          </div>
        )}

        {state.matches('form') && (
          <form
            className="step"
            onSubmit={event_ => {
              event_.preventDefault();
              send({
                type: 'submit',
              });
            }}
          >
            <h2>What can we do better?</h2>
            <Textarea
              name="feedback"
              rows={4}
              placeholder="So many things..."
              onChange={event_ => {
                send({
                  type: 'feedback.update',
                  value: event_.target.value,
                });
              }}
            />
            <Button
              className="button"
              disabled={!state.can({ type: 'submit' })}
            >
              Submit
            </Button>
            <Button
              className="button"
              type="button"
              onClick={() => {
                send({ type: 'back' });
              }}
            >
              Back
            </Button>
          </form>
        )}
      </div>
    );
  },
} satisfies Meta<typeof Stately>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

const feedbackMachine = setup({
  types: {
    context: {} as { feedback: string },
    events: {} as
      | {
          type: 'feedback.good';
        }
      | {
          type: 'feedback.bad';
        }
      | {
          type: 'feedback.update';
          value: string;
        }
      | { type: 'submit' }
      | {
          type: 'close';
        }
      | { type: 'back' }
      | { type: 'restart' },
  },
  guards: {
    feedbackValid: ({ context }) => context.feedback.length > 0,
  },
}).createMachine({
  id: 'feedback',
  initial: 'prompt',
  context: {
    feedback: '',
  },
  states: {
    prompt: {
      on: {
        'feedback.good': 'thanks',
        'feedback.bad': 'form',
      },
    },
    form: {
      on: {
        'feedback.update': {
          actions: assign({
            feedback: ({ event }) => event.value,
          }),
        },
        back: { target: 'prompt' },
        submit: {
          guard: 'feedbackValid',
          target: 'thanks',
        },
      },
    },
    thanks: {},
    closed: {
      on: {
        restart: {
          target: 'prompt',
          actions: assign({
            feedback: '',
          }),
        },
      },
    },
  },
  on: {
    close: '.closed',
  },
});

console.log({ feedbackMachine });
