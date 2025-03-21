'use client'

import type { JSX } from 'react';
import { useEffect } from 'react';

import { AppointmentAvailability } from "./Tools/AppointmentAvailability";
import { AppointmentConfirmation } from "./Tools/AppointmentConfirmation";
import { DealershipAddress } from "./Tools/DealershipAddress";
import { Weather } from "./Tools/Weather";

export const Message = ({ message, assistantMessageId, isComplete }: { message: Message, assistantMessageId: string, isComplete: boolean }) => {
  const isUser = message.isUser;

  const componentObj: Record<ToolOutputType, ({ output }: { output: string }) => JSX.Element> = {
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

  // Update useEffect to handle scrolling
  useEffect(() => {
    if (message.id === assistantMessageId && !isComplete) {
      const element = document.getElementById(message.id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
      }
    }
  }, [message.content, message.id, assistantMessageId, isComplete, message.toolOutput]);

  return (
    <div id={message.id} className="flex flex-col gap-2 animate-fadeIn">
      <div
        className={`
          items-center rounded-[1.5rem] px-4 py-3 text-sm text-wrap
          transition-all duration-200 ease-in-out
          ${isUser
            ? "self-end bg-blue-500 text-white shadow-sm hover:bg-blue-600 max-w-96"
            : "self-start bg-sidebar shadow-sm hover:bg-sidebar-hover"}
        `}
      >
        {renderMessageContent()}
        {!isUser && !isComplete && assistantMessageId === message.id && (
          <div className={`inline-flex space-x-1 ${message.content.length > 0 ? 'ml-2' : ''}`}>
            <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full animation-delay-200"></div>
            <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full animation-delay-400"></div>
          </div>
        )}
      </div>
      <div className='space-y-2'>
        {renderToolOutput()}
      </div>
    </div>
  )
}
