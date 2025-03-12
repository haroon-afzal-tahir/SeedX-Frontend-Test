"use client"

import { useSessions } from "@/context/sessions.context";
import { useParams } from "next/navigation";
import { useState } from "react";

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
    <div className="p-6 bg-background border border-border rounded-lg text-sm">
      <h2 className="font-bold mb-6 text-foreground border-b pb-3">
        Available Appointment Times
      </h2>
      {timeSlots.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-4">
          No available time slots found
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {timeSlots.map((time: string) => (
            <button
              key={time}
              onClick={() => handleClick(time)}
              className="bg-appointment-time-bg text-appointment-time-text 
                py-2 px-3 rounded border-l-4 border-l-appointment-time-border border-t border-r border-b 
                border-border text-center select-none cursor-pointer"
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
