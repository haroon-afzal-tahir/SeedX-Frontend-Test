interface Message {
  id: string;
  content: string;
  createdAt: Date;
  isUser: boolean;
}

interface Session {
  id: string;
  name: string;
  createdAt: Date;
  messages: Message[];
}
