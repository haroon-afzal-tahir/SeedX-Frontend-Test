"use client"

import { useSessions } from "@/context/sessions.context";
import { useParams } from "next/navigation";

export const AppointmentAvailability = ({ output }: { output: string }) => {
  // Parse the string to get the array of times
  const parseTimeSlots = (outputString: string) => {
    try {
      // Remove escape characters, extra quotes, markdown code block syntax, and convert single quotes to double quotes
      const cleanString = outputString
        .replace(/\\"/g, '"') // Remove escaped quotes
        .replace(/^"|"$/g, "") // Remove surrounding quotes
        .replace(/```/g, "") // Remove markdown code block syntax
        .replace(/'/g, '"'); // Convert single quotes to double quotes
      return JSON.parse(cleanString);
    } catch (error) {
      console.error("Error parsing time slots:", error);
      return [];
    }
  };

  const timeSlots = parseTimeSlots(output);
  const { id } = useParams()

  const { addMessage, sessions } = useSessions()

  function handleClick(time: string) {
    const session = sessions.find((s) => s.id === id)
    if (session) {
      // check if there's any message with toolOutput
      const message = session.messages.find((m) => {
        if (m.toolOutput) {
          return m.toolOutput.some((tool) => tool.type === "schedule_appointment")
        }
      })

      if (!message) {
        addMessage(id as string, {
          id: crypto.randomUUID(),
          content: `I would like to book an appointment for ${time}`,
          createdAt: new Date(),
          isUser: true,
          triggered: true,
          toolOutput: []
        })
      }
    }
  }

  return (
    <div className="p-6 bg-sidebar/50 hover:bg-sidebar/70 border border-border/60 rounded-lg text-sm transition-all duration-200 shadow-sm backdrop-blur-sm">
      <h2 className="font-medium text-foreground/90 mb-6 border-b border-border/60 pb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full"></span>
        Available Appointment Times
      </h2>
      {timeSlots.length === 0 ? (
        <p className="text-foreground/70 text-center py-4">
          No available time slots found
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {timeSlots.map((time: string) => (
            <button
              key={time}
              onClick={() => handleClick(time)}
              className="bg-background/50 hover:bg-background text-foreground/80 hover:text-foreground
                py-2.5 px-4 rounded-md border border-border/60 hover:border-border
                text-center select-none cursor-pointer transition-all duration-200
                hover:shadow-sm hover:-translate-y-0.5"
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
