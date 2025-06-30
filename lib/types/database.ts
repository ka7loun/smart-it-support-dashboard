export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  ticket_number: string
  subject: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  type: string
  user_id: string
  assignee_id?: string
  created_at: string
  updated_at: string
  user?: User
  assignee?: User
  comments?: TicketComment[]
  attachments?: TicketAttachment[]
}

export interface TicketComment {
  id: string
  ticket_id: string
  user_id: string
  content: string
  is_internal: boolean
  created_at: string
  user?: User
}

export interface TicketAttachment {
  id: string
  ticket_id: string
  filename: string
  original_name: string
  file_size: number
  mime_type: string
  storage_url: string
  uploaded_by: string
  created_at: string
  user?: User
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  ticket_id?: string
  read: boolean
  created_at: string
  ticket?: Ticket
}

export interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  byPriority: {
    low: number
    medium: number
    high: number
    critical: number
  }
  byType: Record<string, number>
}
