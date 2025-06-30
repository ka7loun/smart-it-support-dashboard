-- Insert demo users
INSERT INTO users (id, email, name, role) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'admin@leoni.com', 'Admin User', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440001', 'user@leoni.com', 'Sarah Johnson', 'user'),
  ('550e8400-e29b-41d4-a716-446655440002', 'mike.chen@leoni.com', 'Mike Chen', 'user'),
  ('550e8400-e29b-41d4-a716-446655440003', 'emma.davis@leoni.com', 'Emma Davis', 'user'),
  ('550e8400-e29b-41d4-a716-446655440004', 'james.wilson@leoni.com', 'James Wilson', 'user'),
  ('550e8400-e29b-41d4-a716-446655440005', 'lisa.rodriguez@leoni.com', 'Lisa Rodriguez', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert demo tickets
INSERT INTO tickets (id, subject, description, status, priority, type, user_id, assignee_id) VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440000',
    'Cannot access company email',
    'I am unable to access my company email account. When I try to log in, I get an error message saying "Invalid credentials" even though I am using the correct password. This started happening yesterday morning.',
    'open',
    'high',
    'access',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'Laptop screen flickering',
    'My laptop screen has been flickering intermittently, especially when using video conferencing tools like Teams or Zoom. The issue seems to worsen when the laptop has been running for more than 2 hours. I have tried restarting multiple times but the problem persists.',
    'in-progress',
    'medium',
    'hardware',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'Software installation request',
    'I need Adobe Photoshop installed on my workstation for the upcoming marketing campaign. I have the license key ready and approval from my manager.',
    'resolved',
    'low',
    'software',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'Network connectivity issues',
    'I am experiencing intermittent network connectivity issues. The connection drops every 10-15 minutes and I have to reconnect to the WiFi. This is affecting my productivity significantly.',
    'open',
    'critical',
    'network',
    '550e8400-e29b-41d4-a716-446655440004',
    NULL
  ),
  (
    '660e8400-e29b-41d4-a716-446655440004',
    'Printer not connecting',
    'The office printer (HP LaserJet Pro) is not showing up in my available printers list. I have tried restarting both my computer and the printer but it still does not appear.',
    'open',
    'medium',
    'hardware',
    '550e8400-e29b-41d4-a716-446655440005',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- Insert demo comments
INSERT INTO ticket_comments (ticket_id, user_id, content, is_internal) VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    'Hi Mike, I have reviewed your case. Let me start by updating your display drivers and running Windows Memory Diagnostic. I will schedule a remote session with you this afternoon to troubleshoot further.',
    false
  ),
  (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    'Thanks for the quick response! I have updated the display drivers as suggested. The flickering seems to have reduced but has not completely stopped. Looking forward to the remote session.',
    false
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440000',
    'Adobe Photoshop has been successfully installed on your workstation. Please test the installation and let me know if you encounter any issues.',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Insert demo notifications
INSERT INTO notifications (user_id, title, message, type, ticket_id) VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Ticket Updated',
    'Your ticket "Cannot access company email" has been assigned to Tech Team',
    'info',
    '660e8400-e29b-41d4-a716-446655440000'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'Ticket Updated',
    'Your ticket "Laptop screen flickering" status changed to in-progress',
    'info',
    '660e8400-e29b-41d4-a716-446655440001'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'Ticket Resolved',
    'Your ticket "Software installation request" has been marked as resolved',
    'success',
    '660e8400-e29b-41d4-a716-446655440002'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'New Ticket Created',
    'New critical ticket "Network connectivity issues" has been submitted',
    'warning',
    '660e8400-e29b-41d4-a716-446655440003'
  )
ON CONFLICT (id) DO NOTHING;
