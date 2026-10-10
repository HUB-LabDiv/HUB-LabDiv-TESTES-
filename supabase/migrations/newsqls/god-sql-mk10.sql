-- migration god-sql-mk10.sql
-- Hub de Comunicação Científica Lab-Div
-- Este programa é software livre: licença AGPLv3

-- 1. Controle de Disponibilidade de Atrações (Admin)
CREATE TABLE IF NOT EXISTS public.show_experiment_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id VARCHAR(50) NOT NULL,
    unavailable_date DATE,            
    unavailable_weekday INTEGER,      
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.show_experiment_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.show_experiment_availability FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.show_experiment_availability FOR ALL TO authenticated USING (true);

-- 2. Agendamentos e Sessões
CREATE TABLE IF NOT EXISTS public.show_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(50) NOT NULL,
    school_name TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    teacher_email TEXT NOT NULL,
    show_number SERIAL,
    teacher_code VARCHAR(20) UNIQUE NOT NULL,      
    student_code VARCHAR(20) UNIQUE NOT NULL,      
    scheduled_date DATE,          
    scheduled_time TIME,          
    status VARCHAR(20) DEFAULT 'scheduled', 
    selected_experiments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.show_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.show_sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.show_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.show_sessions FOR ALL TO authenticated USING (true);

-- 3. Tabela de Percepções Comuns (Por experimento)
CREATE TABLE IF NOT EXISTS public.show_experiment_misconceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id VARCHAR(50) NOT NULL, 
    stage VARCHAR(20) NOT NULL,         
    misconception_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.show_experiment_misconceptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.show_experiment_misconceptions FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.show_experiment_misconceptions FOR ALL TO authenticated USING (true);

-- 4. Respostas dos Alunos
CREATE TABLE IF NOT EXISTS public.show_student_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.show_sessions(id) ON DELETE CASCADE,
    experiment_id VARCHAR(50), 
    stage VARCHAR(20), 
    free_text_answer TEXT, 
    selected_misconception_id UUID REFERENCES public.show_experiment_misconceptions(id) ON DELETE SET NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.show_student_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.show_student_responses FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.show_student_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON public.show_student_responses FOR ALL TO authenticated USING (true);
