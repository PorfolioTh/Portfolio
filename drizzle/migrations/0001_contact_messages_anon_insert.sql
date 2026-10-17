GRANT INSERT ON public.contact_messages TO anon, authenticated;
CREATE POLICY "Anyone can send a contact message" ON public.contact_messages
FOR INSERT TO anon, authenticated
WITH CHECK (char_length(name) BETWEEN 1 AND 100 AND char_length(email) BETWEEN 3 AND 255 AND char_length(message) BETWEEN 1 AND 5000 AND coalesce(char_length(phone),0) <= 30 AND coalesce(char_length(subject),0) <= 200);