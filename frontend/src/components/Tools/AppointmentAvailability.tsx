"use client"

import { useSessions } from "@/context/sessions.context";
import { useParams } from "next/navigation";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";

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
    <div className="w-full bg-sidebar/50 hover:bg-sidebar/70 rounded-xl border border-border/60 
      transition-all duration-200 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-full">
            <IoCalendarClearOutline className="text-2xl text-blue-500" />
          </div>
          <div>
            <h2 className="font-medium text-foreground/90">Available Time Slots</h2>
            <p className="text-xs text-foreground/60 mt-0.5">
              Select a convenient time for your test drive
            </p>
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      <div className="p-6">
        {timeSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 bg-background/50 rounded-lg">
            <IoTimeOutline className="text-4xl text-foreground/30 mb-3" />
            <p className="text-foreground/70 text-center">
              No available time slots found for the selected date
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {timeSlots.map((time: string) => (
              <button
                key={time}
                onClick={() => handleClick(time)}
                className="group relative flex items-center justify-between
                  bg-background/50 hover:bg-background text-foreground/80 hover:text-foreground
                  py-3 px-4 rounded-lg border border-border/60 hover:border-blue-500/50
                  text-center select-none cursor-pointer transition-all duration-200
                  hover:shadow-md hover:-translate-y-0.5"
              >
                <IoTimeOutline className="text-blue-500/50 group-hover:text-blue-500 
                  absolute left-3 transition-colors duration-200" />
                <span className="flex-1 text-sm pl-6">{time}</span>
                <IoChevronForwardOutline className="text-foreground/30 group-hover:text-blue-500 
                  opacity-0 group-hover:opacity-100 transition-all duration-200" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="px-6 py-4 bg-background/50 border-t border-border/60">
        <p className="text-xs text-center text-foreground/60">
          Click on a time slot to schedule your appointment
        </p>
      </div>
    </div>
  );
};
