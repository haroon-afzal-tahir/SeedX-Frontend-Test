type ToolOutputType =
  | "check_appointment_availability"
  | "schedule_appointment"
  | "get_dealership_address"
  | "get_weather";

interface ToolOutput {
  type: ToolOutputType;
  data: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  isUser: boolean;
  toolOutput?: ToolOutput[];
}

interface Session {
  id: string;
  name: string;
  createdAt: Date;
  messages: Message[];
}
