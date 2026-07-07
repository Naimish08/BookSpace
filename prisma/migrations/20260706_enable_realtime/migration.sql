-- Enable Supabase Realtime for live features (book carousel updates + live chat).
-- REPLICA IDENTITY FULL ensures UPDATE/DELETE events carry the previous row data.
ALTER TABLE "Book" REPLICA IDENTITY FULL;
ALTER TABLE "ChatMessage" REPLICA IDENTITY FULL;

-- Add tables to the Supabase Realtime publication so postgres_changes events fire.
ALTER PUBLICATION supabase_realtime ADD TABLE "Book";
ALTER PUBLICATION supabase_realtime ADD TABLE "ChatMessage";
