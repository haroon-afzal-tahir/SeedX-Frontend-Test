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

  const renderToolOutput = () => {
    if (!message.toolOutput || !message.toolOutput.type || !message.toolOutput.data) {
      return null;
    }

    const Component = componentObj[message.toolOutput.type];
    if (!Component) {
      return null;
    }

    try {
      const parsedData = JSON.parse(message.toolOutput.data);
      return <Component output={parsedData?.output} />;
    } catch (e) {
      console.error('Error parsing tool output:', e);
      return null;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={`items-center rounded-[1.5rem] px-4 py-3 text-sm text-wrap ${isUser ? "self-end bg-sidebar max-w-96" : "self-start bg-transparent"}`}>
        {message.content}
        {!isUser && !isComplete && assistantMessageId === message.id && (
          <div className="inline-block align-middle h-2.5 w-2.5 bg-gray-300 rounded-full ml-1 shrink-0" />
        )}
      </div>
      {renderToolOutput()}
    </div>
  )
}
