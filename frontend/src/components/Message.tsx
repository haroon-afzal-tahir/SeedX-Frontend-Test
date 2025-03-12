import type { JSX } from 'react';

import { AppointmentAvailability } from "./AppointmentAvailability";
import { AppointmentConfirmation } from "./AppointmentConfirmation";
import { DealershipAddress } from "./DealershipAddress";
import { Weather } from "./Weather";

export const Message = ({ message, assistantMessageId, isComplete }: { message: Message, assistantMessageId: string, isComplete: boolean }) => {
  const isUser = message.isUser;

  const componentObj: Record<ToolOutputType, ({ output }: { output: any }) => JSX.Element> = {
    check_appointment_availability: AppointmentAvailability,
    schedule_appointment: AppointmentConfirmation,
    get_dealership_address: DealershipAddress,
    get_weather: Weather,
  }

  const renderMessageContent = () => {
    if (typeof message.content === 'string' && message.content.includes('<')) {
      // Split content by tool-use tags and process each part
      const parts = message.content.split(/(<tool-use>.*?<\/tool-use>)/);

      return (
        <div className="prose prose-sm max-w-none">
          {parts.map((part, index) => {
            if (part.startsWith('<tool-use>')) {
              // Extract and parse JSON from tool-use tags
              const jsonContent = part.replace(/<\/?tool-use>/g, '');
              try {
                const parsedJson = JSON.parse(jsonContent);
                return (
                  <pre key={index} className="bg-sidebar-hover p-2 my-2 rounded-md text-xs overflow-x-auto">
                    <code>
                      {JSON.stringify(parsedJson, null, 2)}
                    </code>
                  </pre>
                );
              } catch (e) {
                console.error('Error parsing JSON in message content:', e);
                return null;
              }
            }
            // Regular text content
            return <span key={index}>{part}</span>;
          })}
        </div>
      );
    }
    return message.content;
  };

  const renderToolOutput = () => {
    if (!message.toolOutput || message.toolOutput.length === 0) {
      return null;
    }

    const Components = message.toolOutput.map((toolOutput) => {
      const Component = componentObj[toolOutput.type];
      if (!Component) {
        return null;
      }

      try {
        return <Component key={toolOutput.type} output={toolOutput.data} />;
      } catch (e) {
        console.error('Error parsing tool output:', e);
        return null;
      }
    });

    return Components;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={`items-center rounded-[1.5rem] px-4 py-3 text-sm text-wrap ${isUser ? "self-end bg-sidebar max-w-96" : "self-start bg-transparent"}`}>
        {renderMessageContent()}
        {!isUser && !isComplete && assistantMessageId === message.id && (
          <div className="inline-block align-middle h-2.5 w-2.5 bg-gray-300 rounded-full ml-1 shrink-0" />
        )}
      </div>
      <div className='px-4'>

        {renderToolOutput()}
      </div>
    </div>
  )
}
